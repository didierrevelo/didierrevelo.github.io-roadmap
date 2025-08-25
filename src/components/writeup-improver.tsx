'use client';

import * as React from 'react';
import { improveWriteup, type ImproveWriteupOutput } from '@/ai/flows/improve-writeup-gen-ai';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, Lightbulb, TriangleAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const improveWriteupSchema = z.object({
  writeupText: z.string().min(50, { message: 'Please provide a more detailed write-up (at least 50 characters).' }),
});

export function WriteupImprover() {
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestions(null);

    const formData = new FormData(event.currentTarget);
    const writeupText = formData.get('writeupText') as string;

    const validatedFields = improveWriteupSchema.safeParse({
      writeupText,
    });

    if (!validatedFields.success) {
      const errorMessage = validatedFields.error.flatten().fieldErrors.writeupText?.[0];
      setError(errorMessage || 'Invalid input.');
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/improve-writeup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ writeupText: validatedFields.data.writeupText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get suggestions.');
      }
      
      const result: ImproveWriteupOutput = await response.json();
      setSuggestions(result.suggestions);
      toast({
        title: 'Success!',
        description: 'Suggestions generated successfully.',
      })
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError('An error occurred while generating suggestions. Please try again later.');
      toast({
        variant: 'destructive',
        title: 'API Error',
        description: errorMessage,
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            ref={textAreaRef}
            name="writeupText"
            placeholder="Paste your full write-up here..."
            className="min-h-[200px] bg-card"
            aria-invalid={!!error}
            aria-describedby="writeup-error"
            disabled={loading}
          />
          {error && (
            <p id="writeup-error" className="text-red-600 text-sm mt-2">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? (
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
      </form>

      {suggestions && (
        <Card className="mt-6 bg-background/50">
          <CardContent className="p-6">
            <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2 text-accent">
                <Lightbulb className="h-5 w-5"/>
                AI-Powered Suggestions
            </h3>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-foreground/80">
                {suggestions}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
