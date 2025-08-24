
'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CodeBlock } from '@/components/code-block';
import { WriteupImprover } from '@/components/writeup-improver';
import { InteractiveQuiz } from '@/components/interactive-quiz';
import { roadmapData, Section, Phase, Week, Task, Guide, ResourceCardData } from '@/lib/data';
import { DollarSign, BookOpen, Briefcase, Search, FileText, Languages, Swords, Copy, CheckCircle, ChevronRight, ListTodo, Calendar, Trophy, ArrowRight, BrainCircuit, Mic, Headphones, Settings, StickyNote, LogIn, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const sectionIcons: { [key: string]: React.ElementType } = {
  'Phase 1': DollarSign,
  'Phase 2': BookOpen,
  'Phase 3': Briefcase,
  'Phase 4': Search,
  'Write-up Guide': FileText,
  'English Plan': Languages,
  'HTB Plan': Swords,
  'Write-up Template': Copy,
};

const resourceIcons: { [key: string]: React.ElementType } = {
  Headphones,
  Mic,
  BookOpen,
  Settings,
  Swords,
  Languages,
  Trophy,
};

const priorityStyles = {
  high: 'border-red-500/80',
  medium: 'border-yellow-500/80',
  low: 'border-green-500/80',
};

const priorityBadgeVariant = {
  high: 'destructive',
  medium: 'secondary',
  low: 'default',
} as const;

function RoadmapApp() {
  const [user, loading, error] = useAuthState(auth);
  const [completedTasks, setCompletedTasks] = React.useState<Set<string>>(new Set());
  const [notes, setNotes] = React.useState<{ [key: string]: string }>({});
  const [isLoaded, setIsLoaded] = React.useState(false);

  const allTasks = React.useMemo(() => {
    const tasks: Task[] = [];
    roadmapData.forEach(section => {
      if ('phases' in section) {
        section.phases.forEach(phase => {
          phase.weeks.forEach(week => {
            tasks.push(...week.tasks);
          });
        });
      }
    });
    return tasks;
  }, []);

  const totalTasks = allTasks.length;

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logOut = async () => {
    if (!auth) return;
    await signOut(auth);
    setCompletedTasks(new Set());
    setNotes({});
  };

  React.useEffect(() => {
    const loadUserData = async () => {
      if (user && db) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompletedTasks(new Set(data.completedTasks || []));
          setNotes(data.notes || {});
        }
      }
      setIsLoaded(true);
    };

    if (user) {
        loadUserData();
    } else if (!loading) {
        setIsLoaded(true);
    }
    
  }, [user, loading]);

  const saveData = async (newCompletedTasks: Set<string>, newNotes: { [key: string]: string }) => {
    if (user && db) {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { completedTasks: Array.from(newCompletedTasks), notes: newNotes }, { merge: true });
    }
  };

  const handleTaskToggle = (taskId: string) => {
    const newSet = new Set(completedTasks);
    if (newSet.has(taskId)) {
      newSet.delete(taskId);
    } else {
      newSet.add(taskId);
    }
    setCompletedTasks(newSet);
    saveData(newSet, notes);
  };
  
  const handleNoteChange = (weekId: string, value: string) => {
    const newNotes = { ...notes, [weekId]: value };
    setNotes(newNotes);
    saveData(completedTasks, newNotes);
  };

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks.size / totalTasks) * 100) : 0;
  const currentWeek = totalTasks > 0 ? Math.min(24, Math.floor((completedTasks.size / (totalTasks / 24))) + 1) : 1;
  const estimatedSalary = 2000 + (progressPercentage * 40);

  if (loading || (!isLoaded && user)) {
    return <div className="flex h-screen items-center justify-center bg-background text-foreground">Loading Roadmap...</div>;
  }
  
  if (error) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-background text-destructive p-4">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h2>
          <p className="text-center mb-2">
            There was an error with the Firebase authentication.
          </p>
          <pre className="mt-4 p-4 bg-card rounded-md text-xs whitespace-pre-wrap">{error.message}</pre>
        </div>
      );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
         <Card className="max-w-md w-full shadow-lg">
           <CardHeader>
             <CardTitle className="text-center text-2xl font-bold text-primary">Welcome!</CardTitle>
             <CardDescription className="text-center text-muted-foreground">
               Sign in to save your progress and access your personalized roadmap.
             </CardDescription>
           </CardHeader>
           <CardContent>
              <Button onClick={signInWithGoogle} className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In with Google
              </Button>
           </CardContent>
         </Card>
      </main>
    );
  }

  const renderTask = (task: Task) => (
    <div
      key={task.id}
      className={`flex items-start gap-4 my-2 p-4 rounded-lg border-l-4 transition-all duration-300 ${
        priorityStyles[task.priority]
      } ${completedTasks.has(task.id) ? 'bg-background/30' : 'bg-card'} shadow-sm`}
    >
      <Checkbox
        id={task.id}
        checked={completedTasks.has(task.id)}
        onCheckedChange={() => handleTaskToggle(task.id)}
        className="mt-1"
        aria-labelledby={`label-${task.id}`}
      />
      <label htmlFor={task.id} id={`label-${task.id}`} className={`flex-1 text-sm ${completedTasks.has(task.id) ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
        {task.content}
      </label>
      <Badge variant={priorityBadgeVariant[task.priority]} className="capitalize h-6">
        {task.priority}
      </Badge>
    </div>
  );

  const renderResourceCard = (card: ResourceCardData) => {
    const Icon = resourceIcons[card.icon] || Trophy;
    return (
      <Card key={card.title} className="flex-1 min-w-[300px] shadow-md bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Icon className="w-5 h-5"/>
            {card.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            {card.items.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  };

  const renderGuide = (guide: Guide) => (
    <>
      <p className="text-muted-foreground mb-4">{guide.description}</p>
      {guide.structure && (
        <>
          <h3 className="font-headline text-lg font-semibold mt-6 mb-2 text-primary">🏗️ Standard Write-up Structure</h3>
          <CodeBlock code={guide.structure} language="markdown" />
        </>
      )}
      {guide.tips && (
        <>
          <h3 className="font-headline text-lg font-semibold mt-6 mb-2 text-primary">💡 Tips for Successful Write-ups</h3>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            {guide.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </>
      )}
      {guide.resources && (
        <div className="flex flex-wrap gap-4 mt-4">
          {guide.resources.map(renderResourceCard)}
        </div>
      )}
       {guide.id === 'writeup-improver' && <WriteupImprover />}
    </>
  );

  const renderWeek = (week: Week) => (
    <Accordion key={week.id} type="single" collapsible className="w-full my-2">
      <AccordionItem value={week.id} className="border bg-card/50 rounded-lg shadow-sm">
        <AccordionTrigger className="px-6 py-4 font-semibold text-base hover:no-underline text-card-foreground">
          <div className="flex items-center gap-3">
             <Calendar className="w-5 h-5 text-accent"/>
            <span>{week.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
            {week.description && <p className="text-muted-foreground mb-4">{week.description}</p>}
            {week.tasks.map(renderTask)}
            {week.resources && <div className="flex flex-wrap gap-4 my-4">{week.resources.map(renderResourceCard)}</div>}
            
            <InteractiveQuiz topic={week.quizTopic || week.title} />

            <div className="mt-6">
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2 text-primary">
                <StickyNote className="w-5 h-5"/>
                My Notes
              </h4>
              <Textarea
                placeholder={`Jot down your thoughts, findings, and custom resources for ${week.title}...`}
                value={notes[week.id] || ''}
                onChange={(e) => handleNoteChange(week.id, e.target.value)}
                className="min-h-[120px] bg-background/50"
              />
            </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  const renderPhase = (phase: Phase) => (
    <div key={phase.id}>
      <h3 className="font-headline text-2xl font-bold mt-8 mb-4 text-primary">{phase.title}</h3>
      {phase.weeks.map(renderWeek)}
    </div>
  );
  
  const renderSection = (section: Section) => {
    const Icon = sectionIcons[section.title] || BrainCircuit;

    return (
      <AccordionItem key={section.id} value={section.id} className="border-none mb-4">
        <Card className="overflow-hidden shadow-lg bg-transparent">
          <AccordionTrigger className={`p-6 text-left font-headline text-xl font-bold text-primary-foreground hover:no-underline ${section.gradient}`}>
            <div className="flex items-center gap-4 w-full">
              <Icon className="w-8 h-8"/>
              <span className="flex-1">{section.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-6 bg-card/20">
            {'phases' in section ? section.phases.map(renderPhase) : renderGuide(section)}
          </AccordionContent>
        </Card>
      </AccordionItem>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-2">
                Cybersecurity Roadmap Navigator
              </h1>
              <p className="text-muted-foreground text-lg">
                Didier Revelo's Journey: Developer → Security Professional
              </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-semibold">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="outline" onClick={logOut}>Sign Out</Button>
            </div>
        </header>

        <Card className="mb-8 shadow-md bg-card/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-primary">Overall Progress</span>
                <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} aria-label={`${progressPercentage}% of tasks completed`} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
              <div className="p-4 bg-background/50 rounded-lg">
                <ListTodo className="w-8 h-8 mx-auto text-accent mb-2" />
                <p className="text-2xl font-bold">{completedTasks.size} / {totalTasks}</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <Calendar className="w-8 h-8 mx-auto text-accent mb-2" />
                <p className="text-2xl font-bold">{currentWeek}</p>
                <p className="text-sm text-muted-foreground">Current Week</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <DollarSign className="w-8 h-8 mx-auto text-accent mb-2" />
                <p className="text-2xl font-bold">${estimatedSalary.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Target Salary (USD)</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <Trophy className="w-8 h-8 mx-auto text-accent mb-2" />
                <p className="text-2xl font-bold">Pro</p>
                <p className="text-sm text-muted-foreground">Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Accordion type="multiple" className="w-full space-y-4" defaultValue={['roadmap']}>
          {roadmapData.map(renderSection)}
        </Accordion>
      </div>
    </main>
  );
}

export default function Home() {
    if (!isFirebaseConfigured) {
        return (
          <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground p-8">
            <AlertTriangle className="h-16 w-16 text-yellow-400 mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-center">Firebase Configuration Missing</h2>
            <p className="text-center text-lg text-muted-foreground mb-8 max-w-2xl">
              It looks like your Firebase environment variables are not set up correctly. Please add your Firebase project credentials to the <code className="bg-card px-2 py-1 rounded-md text-accent">.env</code> file to enable authentication and data storage.
            </p>
            <Card className="bg-card p-6 w-full max-w-2xl">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-primary">Action Required</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="mb-4 text-muted-foreground">1. Go to your Firebase project settings.</p>
                    <p className="mb-4 text-muted-foreground">2. Under "Your apps", find your web app and select "Config".</p>
                    <p className="mb-4 text-muted-foreground">3. Copy the key-value pairs from the <code className="text-xs bg-background p-1 rounded-sm">firebaseConfig</code> object.</p>
                    <p className="text-muted-foreground">4. Paste them into the <code className="bg-background px-2 py-1 rounded-md text-accent">.env</code> file in your project root, prefixed with <code className="text-xs bg-background p-1 rounded-sm">NEXT_PUBLIC_</code>.</p>
                </CardContent>
            </Card>
          </div>
        );
    }

    return <RoadmapApp />;
}

    