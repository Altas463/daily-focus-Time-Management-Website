import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isTokenPresent, setIsTokenPresent] = useState<boolean | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsTokenPresent(!!token);
  }, []);

  useEffect(() => {
    // If there is no session and no local token -> not logged in
    if (status === 'unauthenticated' && isTokenPresent === false) {
      router.replace('/auth/login');
    }
  }, [status, isTokenPresent, router]);

  return {
    isLoggedIn: status === 'authenticated' || isTokenPresent,
    user: session?.user || null,
  };
};
