import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
      response.cookies.set('netrawebai_admin_session', '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        sameSite: 'lax',
      });
      return response;
    }

    const { password } = body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin_netrawebai_2026';

    if (!password || String(password).trim() !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid owner password. Please try again.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });

    response.cookies.set('netrawebai_admin_session', 'authenticated_owner_session', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Auth error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const adminCookie = req.cookies.get('netrawebai_admin_session')?.value;
  const authHeader = req.headers.get('authorization') || '';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin_netrawebai_2026';

  const isAuthenticated = 
    adminCookie === 'authenticated_owner_session' ||
    adminCookie === adminPassword ||
    authHeader === `Bearer ${adminPassword}`;

  return NextResponse.json({ authenticated: isAuthenticated });
}
