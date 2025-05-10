// app/api/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateRegister } from '@/lib/validators/auth';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Sử dụng validator đã tách riêng
    const validationError = validateRegister({ email, password, name });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
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

    return NextResponse.json({ message: 'Đăng ký thành công', token });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
