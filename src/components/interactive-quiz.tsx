'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getQuiz, type GenerateQuizState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, Lightbulb, TriangleAlert, CheckCircle, XCircle, Gamepad2, Sparkles, Dices } from 'lucide-react';

const initialState: GenerateQuizState = {
  quiz: null,
};

function SubmitButton({ topic }: { topic: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} name="topic" value={topic}>
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

export function InteractiveQuiz({ topic }: { topic: string }) {
  const [state, formAction] = useFormState(getQuiz, initialState);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };
  
  const resetQuiz = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    // We want to trigger the form action again to get a new quiz.
    // We can't reset the form state directly, but we can re-submit the form.
    formRef.current?.submit();
  }

  // When a new quiz is generated, reset the submission state
  React.useEffect(() => {
    if (state.quiz) {
      setIsSubmitted(false);
      setSelectedAnswers({});
    }
  }, [state.quiz]);


  if (!state.quiz) {
    return (
       <form action={formAction} className="mt-4 border-t pt-4">
        {state.error && (
            <Alert variant="destructive" className="mb-4">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}
        <SubmitButton topic={topic} />
      </form>
    );
  }

  const { title, questions } = state.quiz;
  const score = questions.reduce((acc, question, index) => {
    return selectedAnswers[index] === question.answer ? acc + 1 : acc;
  }, 0);

  return (
    <Card className="mt-6 bg-background/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Gamepad2 className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className={`p-4 rounded-lg border ${ isSubmitted ? (selectedAnswers[index] === q.answer ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10') : 'border-border'}`}>
                <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  value={selectedAnswers[index]}
                  disabled={isSubmitted}
                >
                  {q.options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                      <Label htmlFor={`q${index}-o${i}`}>{option}</Label>
                      {isSubmitted && option === q.answer && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {isSubmitted && selectedAnswers[index] === option && option !== q.answer && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                  ))}
                </RadioGroup>
                {isSubmitted && (
                    <div className="mt-3 text-sm p-3 bg-background/50 rounded-md">
                        <p><span className="font-bold">Explanation:</span> {q.explanation}</p>
                    </div>
                )}
              </div>
            ))}
          </div>
          {!isSubmitted ? (
            <Button type="submit" className="mt-6" disabled={Object.keys(selectedAnswers).length !== questions.length}>Submit Answers</Button>
          ) : (
            <Card className="mt-6 text-center p-4 bg-card">
              <h3 className="text-xl font-bold">Quiz Complete!</h3>
              <p className="text-2xl font-bold my-2 text-primary">{score} / {questions.length}</p>
              <p className="text-muted-foreground">You've completed the challenge. Keep learning!</p>
              <Button onClick={resetQuiz} className="mt-4">
                  <Dices className="mr-2 h-4 w-4"/>
                  Try a New Quiz
              </Button>
            </Card>
          )}
        </form>
         <form action={formAction} className="hidden">
            <input type="hidden" name="topic" value={topic} />
         </form>
      </CardContent>
    </Card>
  );
}
