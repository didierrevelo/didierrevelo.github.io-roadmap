'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getQuiz, type GenerateQuizState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Lightbulb, TriangleAlert, CheckCircle, XCircle, Gamepad2, Sparkles, Dices, RefreshCw } from 'lucide-react';

const initialQuizState: GenerateQuizState = {
  quiz: null,
};

function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Dices className="mr-2 h-4 w-4 animate-spin" />
          Generating Quiz...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Start AI-Powered Quiz
        </>
      )}
    </Button>
  );
}

function SubmitAnswersButton({ numQuestions, numAnswers }: { numQuestions: number; numAnswers: number }) {
    const { pending } = useFormStatus();
    const isAllAnswered = numQuestions === numAnswers;
    return (
        <Button type="submit" className="mt-6 w-full" disabled={pending || !isAllAnswered}>
            {pending ? 'Submitting...' : 'Submit Answers'}
        </Button>
    )
}

function QuizForm({ topic, quiz, onRegenerate }: { topic: string; quiz: NonNullable<GenerateQuizState['quiz']>; onRegenerate: (formData: FormData) => void; }) {
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitted(true);
  };

  const score = React.useMemo(() => {
    if (!submitted) return 0;
    return quiz.questions.reduce((acc, question, index) => {
      return selectedAnswers[index] === question.answer ? acc + 1 : acc;
    }, 0);
  }, [submitted, quiz.questions, selectedAnswers]);
  
  const handleRegenerate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('topic', topic);
    onRegenerate(formData);
  };


  if (submitted) {
     return (
        <Card className="mt-6 text-center p-4 bg-card/50 border-none shadow-none">
            <h3 className="text-xl font-bold">Quiz Complete!</h3>
            <p className="text-2xl font-bold my-2 text-primary">{score} / {quiz.questions.length}</p>
            <div className="space-y-6 text-left mt-6">
                 {quiz.questions.map((q, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${selectedAnswers[index] === q.answer ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                        <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                        <RadioGroup value={selectedAnswers[index]} disabled>
                        {q.options.map((option, i) => (
                            <div key={i} className="flex items-center space-x-2 my-1">
                                <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                                <Label htmlFor={`q${index}-o${i}`} className={`flex items-center ${selectedAnswers[index] === option && option !== q.answer ? 'text-red-400' : ''} ${option === q.answer ? 'text-green-400' : ''}`}>
                                    {option}
                                    {option === q.answer && <CheckCircle className="h-5 w-5 ml-2" />}
                                    {selectedAnswers[index] === option && option !== q.answer && <XCircle className="h-5 w-5 ml-2" />}
                                </Label>
                            </div>
                        ))}
                        </RadioGroup>
                        <div className="mt-3 text-sm p-3 bg-background/50 rounded-md">
                            <p><span className="font-bold text-accent">Explanation:</span> {q.explanation}</p>
                        </div>
                    </div>
                ))}
            </div>
             <Button onClick={handleRegenerate} variant="outline" className="mt-6">
                <RefreshCw className="mr-2 h-4 w-4"/>
                Try a New Quiz on "{topic}"
             </Button>
        </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="space-y-6">
        {quiz.questions.map((q, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
            <p className="font-semibold mb-4 text-card-foreground">{index + 1}. {q.question}</p>
            <RadioGroup
                onValueChange={(value) => handleAnswerChange(index, value)}
                value={selectedAnswers[index]}
            >
                {q.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-3 my-2">
                    <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                    <Label htmlFor={`q${index}-o${i}`} className="cursor-pointer text-muted-foreground hover:text-foreground">{option}</Label>
                </div>
                ))}
            </RadioGroup>
            </div>
        ))}
        </div>
        <SubmitAnswersButton numQuestions={quiz.questions.length} numAnswers={Object.keys(selectedAnswers).length} />
    </form>
  )
}

export function InteractiveQuiz({ topic }: { topic: string }) {
  const [currentTopic, setCurrentTopic] = React.useState(topic);
  const [state, formAction] = useFormState(getQuiz, {...initialQuizState, topic: currentTopic});

  // This key forces React to re-mount the QuizForm component when a new quiz is generated
  const formKey = React.useMemo(() => state.quiz ? `${state.topic}-${Date.now()}` : currentTopic, [state, currentTopic]);
  
  React.useEffect(() => {
    if (state.topic) {
        setCurrentTopic(state.topic);
    }
  }, [state.topic]);

  if (!state.quiz) {
    return (
       <form action={formAction} className="mt-4 border-t pt-4 space-y-4">
        {state.error && (
            <Alert variant="destructive" className="mb-4">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}
        <div>
             <Label htmlFor="topic-input" className="mb-2 block text-sm font-medium text-muted-foreground">
                Quiz Topic
             </Label>
             <Input 
                id="topic-input"
                name="topic" 
                placeholder="Enter a topic to be quizzed on..."
                defaultValue={currentTopic}
                className="bg-card"
            />
        </div>
        <GenerateButton />
      </form>
    );
  }

  const { title } = state.quiz;

  return (
    <Card className="mt-6 bg-background/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Gamepad2 className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <QuizForm key={formKey} topic={state.topic || currentTopic} quiz={state.quiz} onRegenerate={formAction} />
      </CardContent>
    </Card>
  );
}
