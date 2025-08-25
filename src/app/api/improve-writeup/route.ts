import { improveWriteup, type ImproveWriteupInput } from '@/ai/flows/improve-writeup-gen-ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const improveWriteupSchema = z.object({
  writeupText: z.string().min(50),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedFields = improveWriteupSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid input. Write-up must be at least 50 characters.' },
        { status: 400 }
      );
    }

    const result = await improveWriteup({ writeupText: validatedFields.data.writeupText });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error in /api/improve-writeup:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
        { error: `An internal server error occurred: ${errorMessage}` }, 
        { status: 500 }
    );
  }
}
