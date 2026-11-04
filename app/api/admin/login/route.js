import { NextResponse } from 'next/server';
import { authenticateAdmin, signToken, COOKIE_NAME } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid email or password' },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const adminUser = await authenticateAdmin(email, password);

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signToken({
      email: adminUser.email,
      role: 'admin',
      id: adminUser.id || 'env-admin',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: { email: adminUser.email },
    });

    // Set secure httpOnly cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}
