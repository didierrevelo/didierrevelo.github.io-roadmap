'use server';

import { improveWriteup } from '@/ai/flows/improve-writeup-gen-ai';
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
