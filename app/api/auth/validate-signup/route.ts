import { NextResponse } from 'next/server';

type ReqBody = {
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
};

export async function POST(req: Request) {
  try {
    const body: ReqBody = await req.json();
    const { email, password, phone } = body;

    const errors: Record<string, string> = {};

    // Basic checks
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    // Optional: basic phone format check (very permissive)
    if (phone && typeof phone === 'string' && phone.length < 7) {
      errors.phone = 'Please provide a valid phone number.';
    }

    // If basic validation failed, return early
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // If Clerk API key is configured, check whether email already exists
    const clerkKey = process.env.CLERK_API_KEY || process.env.CLERK_SECRET_KEY || process.env.NEXT_PUBLIC_CLERK_API_KEY;
    if (clerkKey) {
      const url = `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email as string)}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${clerkKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!resp.ok) {
        // Clerk query failed — return a generic server error
        return NextResponse.json({ ok: false, errors: { general: 'Unable to validate email at this time.' } }, { status: 502 });
      }

      const users = await resp.json();
      if (Array.isArray(users) && users.length > 0) {
        return NextResponse.json({ ok: false, errors: { email: 'Email is already registered.' } }, { status: 409 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, errors: { general: 'Invalid request' } }, { status: 400 });
  }
}
