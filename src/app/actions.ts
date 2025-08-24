'use server';

import { improveWriteup } from '@/ai/flows/improve-writeup-gen-ai';
import { generateQuiz, type GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import { z } from 'zod';

const improveWriteupSchema = z.object({
  writeupText: z.string().min(50, { message: 'Please provide a more detailed write-up (at least 50 characters).' }),
});

export type ImproveWriteupFormState = {
  message: string;
  suggestions: string | null;
  errors: {
    writeupText?: string[];
  } | null;
};

export async function getSuggestions(
  prevState: ImproveWriteupFormState,
  formData: FormData
): Promise<ImproveWriteupFormState> {
  const validatedFields = improveWriteupSchema.safeParse({
    writeupText: formData.get('writeupText'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      suggestions: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await improveWriteup({ writeupText: validatedFields.data.writeupText });
    return {
      message: 'Suggestions generated successfully.',
      suggestions: result.suggestions,
      errors: null,
    };
  } catch (error) {
    console.error('AI Error:', error);
    return {
      message: 'An error occurred while generating suggestions. Please try again later.',
      suggestions: null,
      errors: null,
    };
  }
}

const generateQuizSchema = z.object({
  topic: z.string(),
});

export type GenerateQuizState = {
  quiz: GenerateQuizOutput | null;
  error?: string;
  topic?: string;
};

async function generateQuizWithRetry(topic: string, retries = 1): Promise<GenerateQuizOutput> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const quiz = await generateQuiz({ topic });
      return quiz;
    } catch (error) {
      lastError = error;
      console.warn(`Quiz generation attempt ${i + 1} failed. Retrying...`);
    }
  }
  console.error('Quiz Generation Error after all retries:', lastError);
  throw lastError;
}


export async function getQuiz(
  prevState: GenerateQuizState,
  formData: FormData
): Promise<GenerateQuizState> {
  const validatedFields = generateQuizSchema.safeParse({
    topic: formData.get('topic'),
  });

  if (!validatedFields.success) {
    return {
      quiz: null,
      error: 'Invalid topic provided.',
    };
  }
  
  const topic = validatedFields.data.topic;

  try {
    const quiz = await generateQuizWithRetry(topic);
    return { quiz, topic, error: undefined };
  } catch (error) {
    return {
      quiz: null,
      topic,
      error: 'Failed to generate the quiz. The AI might be busy, please try again in a moment.',
    };
  }
}
