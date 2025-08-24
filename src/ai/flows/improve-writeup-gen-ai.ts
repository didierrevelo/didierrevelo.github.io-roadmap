'use server';
/**
 * @fileOverview A write-up improvement AI agent.
 *
 * - improveWriteup - A function that handles the write-up improvement process.
 * - ImproveWriteupInput - The input type for the improveWriteup function.
 * - ImproveWriteupOutput - The return type for the improveWriteup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveWriteupInputSchema = z.object({
  writeupText: z
    .string()
    .describe('The text content of the cybersecurity write-up to be improved.'),
});
export type ImproveWriteupInput = z.infer<typeof ImproveWriteupInputSchema>;

const ImproveWriteupOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'AI-powered suggestions for improving the write-up, focusing on completeness, clarity, and actionable insights for remediation.'
    ),
});
export type ImproveWriteupOutput = z.infer<typeof ImproveWriteupOutputSchema>;

export async function improveWriteup(input: ImproveWriteupInput): Promise<ImproveWriteupOutput> {
  return improveWriteupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveWriteupPrompt',
  input: {schema: ImproveWriteupInputSchema},
  output: {schema: ImproveWriteupOutputSchema},
  prompt: `You are an AI assistant designed to provide constructive feedback on cybersecurity write-ups.

  Your goal is to analyze the provided write-up and suggest concrete improvements, focusing on the following aspects:

  - Completeness: Ensure all essential sections are present (Executive Summary, Reconnaissance, Enumeration, Exploitation, Post-Exploitation, Remediation).
  - Clarity: Verify that the explanations are easy to understand, the steps are well-defined, and the technical terms are properly introduced.
  - Actionable Insights for Remediation: Offer specific, actionable recommendations for fixing the identified vulnerabilities and improving the overall security posture.

  Provide your suggestions in a well-structured format.

  Write-up:
  {{{writeupText}}}`,
});

const improveWriteupFlow = ai.defineFlow(
  {
    name: 'improveWriteupFlow',
    inputSchema: ImproveWriteupInputSchema,
    outputSchema: ImproveWriteupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
