"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface JwtPayload {
  name: string;
  email: string;
  exp?: number;
  iat?: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const validateInput = () => {
    if (!email || !password) {
      setErrorMessage("Vui lòng điền đầy đủ các trường");
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Email không hợp lệ");
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErrorMessage(error?.error || "Đăng nhập thất bại");
        return;
      }

      const { token } = await res.json();

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          localStorage.setItem("name", decoded.name);
        } catch (err) {
          console.error("Lỗi khi giải mã token:", err);
        }
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setErrorMessage("Lỗi kết nối đến máy chủ");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Đăng nhập vào <span className="text-blue-600">Daily Focus</span>
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Thông báo lỗi */}
          {errorMessage && (
            <div className="text-red-600 text-sm">{errorMessage}</div>
          )}

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition cursor-pointer"
          >
            Đăng nhập
          </button>
        </form>
        {/* Hoặc đăng nhập bằng Google */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              hoặc
            </span>
          </div>
        </div>

        <button
          onClick={() => signIn("google")}
          type="button"
          className="mt-4 w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl hover:shadow transition cursor-pointer"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
          Đăng nhập với Google
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
