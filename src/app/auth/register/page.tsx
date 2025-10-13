'use client';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import AuthPageShell from "@/components/auth/AuthPageShell";
import { useSpotlightStage } from "@/hooks/useSpotlightStage";
import { calculatePasswordStrength } from "@/utils/password";
import { getMotivationTip } from "@/utils/motivation";

interface JwtPayload {
  name: string;
  email: string;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordMax, setPasswordMax] = useState(5);
  const [capsOnPw, setCapsOnPw] = useState(false);
  const [capsOnConfirm, setCapsOnConfirm] = useState(false);
  const router = useRouter();
  const { stageRef, handleMouseMove } = useSpotlightStage();
  const motivationTip = useMemo(() => getMotivationTip(new Date().setHours(0, 0, 0, 0) + 1), []);

  useEffect(() => {
    const { score, maxScore } = calculatePasswordStrength(password, { includeLowercase: true });
    setPasswordScore(score);
    setPasswordMax(maxScore);
  }, [password]);

  const validateInput = () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Vui long dien day du cac truong");
      return false;
    }
    if (name.trim().length < 2) {
      setErrorMessage("Ten can it nhat 2 ky tu");
      return false;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Email khong hop le");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("Mat khau can it nhat 8 ky tu");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Mat khau xac nhan khong khop");
      return false;
    }
    return true;
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!validateInput()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setErrorMessage(errorData.error || "Dang ky that bai. Vui long thu lai");
        setIsLoading(false);
        return;
      }

      const { token } = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        try {
          const decoded: JwtPayload = jwtDecode(token);
          localStorage.setItem("name", decoded.name || "User");
        } catch (error) {
          console.error("Khong the giai ma token:", error);
        }
      }

      setIsLoading(false);
      router.push("/auth/login");
    } catch (error) {
      console.error("Loi ket noi:", error);
      setErrorMessage("Khong the ket noi den may chu");
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell
      stageRef={stageRef}
      onMouseMove={handleMouseMove}
      variant="green"
      hero={
        <>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-emerald-700 to-teal-700 bg-clip-text text-transparent dark:from-white dark:via-emerald-300 dark:to-teal-300"
          >
            Bat dau hanh trinh tap trung
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 max-w-md text-lg text-gray-700/80 dark:text-gray-300"
          >
            Tao tai khoan Daily Focus de gom viec, dat muc tieu va tien nhanh hon moi ngay.
          </motion.p>
        </>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] p-6 sm:p-8"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Tao tai khoan
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Chi mat vai phut de bat dau nang suat hon
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Ten
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nguyen Van A"
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Mat khau
              </label>
              {capsOnPw && (
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  Caps Lock dang bat
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyUp={(event) => setCapsOnPw(event.getModifierState && event.getModifierState("CapsLock"))}
                placeholder="Nhap mat khau"
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-3 pr-16 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300"
                aria-label={showPassword ? "An mat khau" : "Hien mat khau"}
              >
                {showPassword ? "An" : "Hien"}
              </button>
            </div>

            {password && (
              <div className="space-y-1">
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-300 bg-emerald-500"
                    style={{ width: passwordMax ? `${(passwordScore / passwordMax) * 100}%` : "0%" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Do manh:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {["Rat yeu", "Yeu", "Trung binh", "Kha", "Manh", "Rat manh"][passwordScore] || ""}
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    Goi y: 8 ky tu, chu hoa/thuong, so, ky tu dac biet
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Xac nhan mat khau
              </label>
              {capsOnConfirm && (
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  Caps Lock dang bat
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onKeyUp={(event) => setCapsOnConfirm(event.getModifierState && event.getModifierState("CapsLock"))}
                placeholder="Nhap lai mat khau"
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-3 pr-16 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300"
                aria-label={showConfirmPassword ? "An mat khau xac nhan" : "Hien mat khau xac nhan"}
              >
                {showConfirmPassword ? "An" : "Hien"}
              </button>
            </div>
            <div className="mt-1 text-xs">
              {confirmPassword &&
                (password === confirmPassword ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Mat khau khop</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">Mat khau khong khop</span>
                ))}
            </div>
          </div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-xl border border-red-200/60 dark:border-red-800/50 bg-red-50/70 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-6 py-3 font-semibold shadow-lg transition hover:translate-y-[-1px] hover:bg-black/90 focus:outline-none focus:ring-4 focus:ring-gray-900/20 disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
          >
            {isLoading ? "Dang tao tai khoan..." : "Tao tai khoan"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs italic text-gray-500 dark:text-gray-400">
          Meo nho: {motivationTip}
        </p>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Da co tai khoan?{" "}
          <Link href="/auth/login" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
            Dang nhap ngay
          </Link>
        </p>
      </motion.div>
    </AuthPageShell>
  );
}
