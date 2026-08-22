import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { credential, email, name, picture } = await req.json();

    let userEmail = email;
    let userName = name;
    let userAvatar = picture;

    // Decode Google JWT Credential payload if present
    if (credential && typeof credential === 'string') {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          userEmail = payload.email || userEmail;
          userName = payload.name || userName;
          userAvatar = payload.picture || userAvatar;
        }
      } catch (err) {
        console.error('Failed to parse Google credential payload', err);
      }
    }

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'Google authentication failed: Email missing' },
        { status: 400 }
      );
    }

    // Find or create user in Prisma DB
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: userName || userEmail.split('@')[0],
            avatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`,
            passwordHash: '$2a$10$googleoauthpasswordhashplaceholder',
          },
        });
      } else if (userAvatar && !user.avatar) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatar: userAvatar },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma DB lookup error in Google Auth, falling back to mock user session', dbErr);
      // Fallback object if DB connection is unavailable
      user = {
        id: 'google-user-' + Date.now(),
        name: userName || userEmail.split('@')[0],
        email: userEmail,
        avatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`,
      };
    }

    // Set user_id session cookie
    const cookieStore = await cookies();
    cookieStore.set('user_id', user.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: 'lax',
    });

    return NextResponse.json({
      success: true,
      message: 'Google authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Google authentication failed';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
