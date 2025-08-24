'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getSuggestions, type FormState } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, Lightbulb, TriangleAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const initialState: FormState = {
  message: '',
  suggestions: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <BrainCircuit className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export function WriteupImprover() {
  const [state, formAction] = useFormState(getSuggestions, initialState);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (state.message && state.errors) {
       // Focus on textarea if there is an error
       textAreaRef.current?.focus();
    }
  }, [state]);


  return (
    <div className="mt-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Textarea
            ref={textAreaRef}
            name="writeupText"
            placeholder="Paste your full write-up here..."
            className="min-h-[200px] bg-white"
            aria-invalid={!!state.errors?.writeupText}
            aria-describedby="writeup-error"
          />
          {state.errors?.writeupText && (
            <p id="writeup-error" className="text-red-600 text-sm mt-2">
              {state.errors.writeupText[0]}
            </p>
          )}
        </div>
        <SubmitButton />
      </form>

      {state.message && !state.suggestions && (
         <Alert variant={state.errors ? "destructive" : "default"} className="mt-4">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>{state.errors ? "Error" : "Notice"}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
         </Alert>
      )}

      {state.suggestions && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2 text-primary">
                <Lightbulb className="h-5 w-5"/>
                AI-Powered Suggestions
            </h3>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-gray-700">
                {state.suggestions}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
