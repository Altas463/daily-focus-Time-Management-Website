// lib/validators/auth.ts

export function validateLogin({
  email,
  password,
}: {
  email?: string;
  password?: string;
}): string | null {
  if (!email || !password) {
    return 'Please provide both email and password';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Invalid email';
  }

  return null;
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
    return 'Please fill out all required fields';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Invalid email';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
}
