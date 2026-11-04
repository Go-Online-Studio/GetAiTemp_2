import { NextResponse } from 'next/server';
import { unlockVideoPrompt } from '@/lib/data-source';
import { unlockSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // Rate limiting: max 25 unlocks per minute per IP
    const limiter = rateLimit(ip, 'unlock', 25, 60000);
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many unlock requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const validation = unlockSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid request' },
        { status: 400 }
      );
    }

    const { videoId } = validation.data;
    const unlocked = await unlockVideoPrompt(videoId);

    if (!unlocked) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      prompt: unlocked.prompt,
      aiTool: unlocked.aiTool,
      title: unlocked.title,
    });
  } catch (error) {
    console.error('Unlock error:', error);
    return NextResponse.json(
      { error: 'Failed to unlock prompt' },
      { status: 500 }
    );
  }
}
