import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Demo authentication logic
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: 'usr_demo',
        name: 'Nirmal Purja',
        email: email,
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
