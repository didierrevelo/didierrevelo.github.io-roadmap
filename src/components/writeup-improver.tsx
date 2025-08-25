'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Lightbulb } from 'lucide-react';
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
    
    // NOTE: AI functionality is temporarily disabled to allow for static export.
    // This will be re-enabled using a different method in the future.
    setTimeout(() => {
      setError("AI functionality is temporarily disabled.");
      toast({
        variant: 'destructive',
        title: 'Feature Disabled',
        description: 'The AI write-up improver is currently unavailable in this version.',
      });
      setLoading(false);
    }, 1000);
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
