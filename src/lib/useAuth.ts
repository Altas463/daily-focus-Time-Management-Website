'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Đây là hook kiểm tra đăng nhập
export const useAuth = () => {
  const router = useRouter();

  // Lấy JWT từ cookie hoặc localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    // Nếu không có token, chuyển hướng đến trang login
    if (!token) {
      router.replace('/auth/login');
    }
  }, [token, router]);

  return { isLoggedIn: !!token };
};
