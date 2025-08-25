import { improveWriteup } from '@/ai/flows/improve-writeup-gen-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { writeupText } = await req.json();

    if (!writeupText) {
      return NextResponse.json({ error: 'writeupText is required' }, { status: 400 });
    }
    
    const result = await improveWriteup({ writeupText });

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
