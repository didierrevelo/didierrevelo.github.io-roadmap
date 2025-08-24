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
import { roadmapData, Section, Phase, Week, Task, Guide, ResourceCardData } from '@/lib/data';
import { DollarSign, BookOpen, Briefcase, Search, FileText, Languages, Swords, Copy, CheckCircle, ChevronRight, ListTodo, Calendar, Trophy, ArrowRight, BrainCircuit } from 'lucide-react';

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

export default function Home() {
  const [completedTasks, setCompletedTasks] = React.useState<Set<string>>(new Set());
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

  React.useEffect(() => {
    const storedProgress = localStorage.getItem('cybersecurityProgress');
    if (storedProgress) {
      setCompletedTasks(new Set(JSON.parse(storedProgress)));
    }
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cybersecurityProgress', JSON.stringify(Array.from(completedTasks)));
    }
  }, [completedTasks, isLoaded]);

  const handleTaskToggle = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks.size / totalTasks) * 100) : 0;
  const currentWeek = totalTasks > 0 ? Math.min(24, Math.floor((completedTasks.size / (totalTasks / 24))) + 1) : 1;
  const estimatedSalary = 2000 + (progressPercentage * 40);

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const renderTask = (task: Task) => (
    <div
      key={task.id}
      className={`flex items-start gap-4 my-2 p-4 rounded-lg border-l-4 transition-all duration-300 ${
        priorityStyles[task.priority]
      } ${completedTasks.has(task.id) ? 'bg-green-50' : 'bg-white'} shadow-sm`}
    >
      <Checkbox
        id={task.id}
        checked={completedTasks.has(task.id)}
        onCheckedChange={() => handleTaskToggle(task.id)}
        className="mt-1"
        aria-labelledby={`label-${task.id}`}
      />
      <label htmlFor={task.id} id={`label-${task.id}`} className={`flex-1 text-sm ${completedTasks.has(task.id) ? 'line-through text-gray-500' : ''}`}>
        {task.content}
      </label>
      <Badge variant={priorityBadgeVariant[task.priority]} className="capitalize h-6">
        {task.priority}
      </Badge>
    </div>
  );

  const renderResourceCard = (card: ResourceCardData) => (
    <Card key={card.title} className="flex-1 min-w-[300px] shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          {card.icon === 'Trophy' && <Trophy className="w-5 h-5"/>}
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
  );

  const renderGuide = (guide: Guide) => (
    <>
      <p className="text-muted-foreground mb-4">{guide.description}</p>
      {guide.structure && (
        <>
          <h3 className="font-headline text-lg font-semibold mt-6 mb-2">🏗️ Standard Write-up Structure</h3>
          <CodeBlock code={guide.structure} language="markdown" />
        </>
      )}
      {guide.tips && (
        <>
          <h3 className="font-headline text-lg font-semibold mt-6 mb-2">💡 Tips for Successful Write-ups</h3>
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
      <AccordionItem value={week.id} className="border bg-white rounded-lg shadow-sm">
        <AccordionTrigger className="px-6 py-4 font-semibold text-base hover:no-underline">
          <div className="flex items-center gap-3">
             <Calendar className="w-5 h-5 text-primary"/>
            <span>{week.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
            {week.description && <p className="text-muted-foreground mb-4">{week.description}</p>}
            {week.resources && <div className="flex flex-wrap gap-4 my-4">{week.resources.map(renderResourceCard)}</div>}
            {week.tasks.map(renderTask)}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  const renderPhase = (phase: Phase) => (
    <div key={phase.id}>
      <h3 className="font-headline text-2xl font-bold mt-8 mb-4">{phase.title}</h3>
      {phase.weeks.map(renderWeek)}
    </div>
  );
  
  const renderSection = (section: Section) => {
    const Icon = sectionIcons[section.title] || BrainCircuit;
    const isAiImprover = section.id === 'writeup-improver';

    return (
      <AccordionItem key={section.id} value={section.id} className="border-none mb-4">
        <Card className="overflow-hidden shadow-lg">
          <AccordionTrigger className={`p-6 text-left font-headline text-xl font-bold text-primary-foreground hover:no-underline ${section.gradient}`}>
            <div className="flex items-center gap-4 w-full">
              <Icon className="w-8 h-8"/>
              <span className="flex-1">{section.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-6">
            {'phases' in section ? section.phases.map(renderPhase) : renderGuide(section)}
          </AccordionContent>
        </Card>
      </AccordionItem>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-2">
            Cybersecurity Roadmap Navigator
          </h1>
          <p className="text-muted-foreground text-lg">
            Didier Revelo's Journey: Developer → Security Professional
          </p>
        </header>

        <Card className="mb-8 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-primary">Overall Progress</span>
                <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} aria-label={`${progressPercentage}% of tasks completed`} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <ListTodo className="w-8 h-8 mx-auto text-accent mb-2" />
                <p className="text-2xl font-bold">{completedTasks.size} / {totalTasks}</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-8 h-8 mx-auto text-accent mb-2" />
                <p className="text-2xl font-bold">{currentWeek}</p>
                <p className="text-sm text-muted-foreground">Current Week</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-8 h-8 mx-auto text-accent mb-2" />
                <p className="text-2xl font-bold">${estimatedSalary.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Target Salary (USD)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Trophy className="w-8 h-8 mx-auto text-accent mb-2" />
                <p className="text-2xl font-bold">Pro</p>
                <p className="text-sm text-muted-foreground">Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Accordion type="multiple" className="w-full space-y-4">
          {roadmapData.map(renderSection)}
        </Accordion>
      </div>
    </main>
  );
}
