'use server';
/**
 * @fileOverview An AI agent for generating interactive quizzes on cybersecurity topics.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateQuizInputSchema, GenerateQuizOutputSchema } from '@/lib/types';
import type { GenerateQuizInput } from '@/lib/types';


export async function generateQuiz(input: GenerateQuizInput): Promise<{ quizMarkdown: string }> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are a Senior Cybersecurity Mentor. Create a 5-question multiple-choice quiz on the topic of **{{{topic}}}**.

  Format the output as a single block of Markdown.

  **Instructions:**
  1.  Start with a title line, beginning with '#'.
  2.  For each question, start with a number followed by a period (e.g., "1.").
  3.  Provide 4 options for each question.
  4.  Incorrect answers should start with '- [ ]'.
  5.  The single correct answer should start with '- [x]'.
  6.  After the options for each question, add a line that starts with "Explanation:" followed by a brief, clear explanation of the correct answer.

  **Example Format:**

  # Phishing Attacks Quiz
  1. What is the primary goal of a phishing attack?
  - [ ] To install a virus
  - [ ] To crash a server
  - [x] To steal sensitive information
  - [ ] To perform a DDoS attack
  Explanation: Phishing attacks primarily aim to trick users into revealing sensitive data like credentials or financial information.
  
  2. Which of these is a common red flag for a phishing email?
  ... and so on for 5 questions.
  `,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
