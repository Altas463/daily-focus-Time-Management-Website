// lib/validators/auth.ts

export function validateLogin({
  email,
  password,
}: {
  email?: string;
  password?: string;
}): string | null {
  if (!email || !password) {
    return 'Vui lòng điền đầy đủ email và mật khẩu';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Email không hợp lệ';
  }

  return null; // hợp lệ
}

export function validateRegister({
  name,
  email,
  password,
}: {
  name?: string;
  email?: string;
  password?: string;
}): string | null {
  if (!name || !email || !password) {
    return 'Vui lòng điền đầy đủ các trường';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Email không hợp lệ';
  }

  if (password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  return null;
}
