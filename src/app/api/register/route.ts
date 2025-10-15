import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateRegister } from '@/lib/validators/auth';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Validate input
    const validationError = validateRegister({ email, password, name });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        provider: 'credentials',
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      error: 'Server error',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
