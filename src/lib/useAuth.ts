'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Đây là hook kiểm tra đăng nhập
export const useAuth = () => {
  const router = useRouter();

  // ⚠️ Giả lập trạng thái đăng nhập
  const isLoggedIn = true; // true = login success

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, router]);

  return { isLoggedIn };
};
