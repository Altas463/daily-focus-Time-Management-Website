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

    // Kiểm tra biến môi trường
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET chưa được định nghĩa');
    }

    // Kiểm tra user tồn tại
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
    console.error('Đăng ký lỗi:', error);
    return NextResponse.json({
      error: 'Lỗi server',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
