import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: `usr_${Date.now()}`,
        name,
        email,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}
