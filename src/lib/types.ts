import { z } from 'zod';

// Basic data structures
export interface Task {
  id: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ResourceCardData {
  title: string;
  icon: string;
  items: string[];
}

export interface Week {
  id:string;
  title: string;
  description?: string;
  quizTopic?: string;
  tasks: Task[];
  resources?: ResourceCardData[];
}

export interface Phase {
  id: string;
  title: string;
  weeks: Week[];
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  gradient: string;
  structure?: string;
  tips?: string[];
  resources?: ResourceCardData[];
}

export type Section = Guide | {
  id: string;
  title: string;
  gradient: string;
  phases: Phase[];
};


// Genkit Quiz Schemas
export const GenerateQuizInputSchema = z.object({
  topic: z
    .string()
    .describe('The specific cybersecurity topic for which to generate a quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

export const QuestionSchema = z.object({
    question: z.string().describe('The question text.'),
    options: z.array(z.string()).describe('An array of 4 possible answers.'),
    answer: z.string().describe('The correct answer from the options array.'),
    explanation: z.string().describe('A brief explanation of why the answer is correct.'),
});
export type Question = z.infer<typeof QuestionSchema>;

export const GenerateQuizOutputSchema = z.object({
  quizMarkdown: z.string().describe('The entire quiz formatted as a single markdown string.'),
});

export type GenerateQuizOutput = {
  title: string;
  questions: Question[];
};
