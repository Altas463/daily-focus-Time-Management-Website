// app/api/login/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateLogin } from '@/lib/validators/auth';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Sử dụng hàm kiểm tra đầu vào từ validator
    const validationError = validateLogin({ email, password });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name || '',
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
