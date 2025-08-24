'use server';

import { improveWriteup } from '@/ai/flows/improve-writeup-gen-ai';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import type { GenerateQuizOutput, Question } from '@/lib/types';
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

function parseQuizMarkdown(markdown: string): GenerateQuizOutput {
  const lines = markdown.split('\n').filter(line => line.trim() !== '');
  
  const title = lines[0].replace('# ', '').trim();
  const questions: Question[] = [];
  
  let currentQuestion: Partial<Question> & { options: string[] } = { options: [] };
  let questionIndex = -1;

  lines.slice(1).forEach(line => {
    if (line.match(/^\d+\.\s/)) { // Question
      if (Object.keys(currentQuestion).length > 1) { // more than just {options: []}
        questions.push(currentQuestion as Question);
      }
      questionIndex++;
      currentQuestion = {
        question: line.replace(/^\d+\.\s/, '').trim(),
        options: [],
      };
    } else if (line.match(/^- \[x\]/)) { // Correct Answer
      const option = line.replace(/^- \[x\]\s/, '').trim();
      currentQuestion.options.push(option);
      currentQuestion.answer = option;
    } else if (line.match(/^- \[\s\]/)) { // Incorrect Answer
      const option = line.replace(/^- \[\s\]\s/, '').trim();
      currentQuestion.options.push(option);
    } else if (line.toLowerCase().startsWith('explanation:')) { // Explanation
      currentQuestion.explanation = line.substring('explanation:'.length).trim();
    }
  });

  if (Object.keys(currentQuestion).length > 1) {
    questions.push(currentQuestion as Question);
  }

  if (questions.length === 0 || !title) {
      throw new Error("Failed to parse the generated quiz markdown.");
  }

  return { title, questions };
}

async function generateQuizWithRetry(topic: string, retries = 1): Promise<GenerateQuizOutput> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await generateQuiz({ topic });
      // The AI now returns markdown, so we parse it here.
      const parsedQuiz = parseQuizMarkdown(result.quizMarkdown);
      return parsedQuiz;
    } catch (error) {
      lastError = error;
      console.warn(`Quiz generation attempt ${i + 1} failed. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s before retrying
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
    console.error(error);
    return {
      quiz: null,
      topic,
      error: 'Failed to generate the quiz. The AI might be busy, please try again in a moment.',
    };
  }
}
