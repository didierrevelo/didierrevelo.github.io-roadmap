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

const GenerateQuizInputSchema = z.object({
  topic: z
    .string()
    .describe('The specific cybersecurity topic for which to generate a quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuestionSchema = z.object({
    question: z.string().describe('The question text.'),
    options: z.array(z.string()).describe('An array of 4 possible answers.'),
    answer: z.string().describe('The correct answer from the options array.'),
    explanation: z.string().describe('A brief explanation of why the answer is correct.'),
});

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('A catchy title for the quiz related to the topic.'),
  questions: z.array(QuestionSchema).describe('An array of 5 quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are a Senior Cybersecurity Mentor and gamification expert. Your task is to create an engaging, interactive multiple-choice quiz for a student learning to become a security professional.

The quiz should be based on the following topic: **{{{topic}}}**

**Instructions:**
1.  **Generate 5 Relevant Questions:** Create a total of five high-quality questions that are directly relevant to the provided topic.
2.  **Multiple-Choice Format:** Each question must have exactly 4 options. One option must be clearly correct. The other options should be plausible but incorrect distractors.
3.  **Answer and Explanation:** For each question, provide the correct answer and a concise, clear explanation for why it's correct. The explanation should reinforce the learning concept.
4.  **Engaging Tone:** The title and questions should be slightly gamified and encouraging.

Make the quiz challenging but fair for someone actively learning this topic. Ensure all 5 questions are generated.`,
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
