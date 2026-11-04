import { NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/data-source';
import { contactSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // Max 5 contact messages per 15 minutes per IP
    const limiter = rateLimit(ip, 'contact', 5, 15 * 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait a little while before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid form data' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    const saved = await createContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      id: saved._id,
    });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
