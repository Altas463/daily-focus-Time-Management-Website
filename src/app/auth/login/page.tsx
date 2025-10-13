"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthPageShell from "@/components/auth/AuthPageShell";
import { useSpotlightStage } from "@/hooks/useSpotlightStage";
import { calculatePasswordStrength } from "@/utils/password";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [remember, setRemember] = useState(true);
  const [pwScore, setPwScore] = useState(0);
  const [pwMax, setPwMax] = useState(4);
  const router = useRouter();
  const { stageRef, handleMouseMove } = useSpotlightStage();

  const validateInput = () => {
    if (!email || !password) {
      setErrorMessage("Vui long dien day du cac truong");
      return false;
    }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Email khong hop le");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const { score, maxScore } = calculatePasswordStrength(password);
    setPwScore(score);
    setPwMax(maxScore);
  }, [password]);

  const strengthLabel = ["Yeu", "Trung binh", "Kha", "Manh", "Rat manh"][pwScore] || "";
  const strengthClass =
    ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-emerald-600"][pwScore] ||
    "bg-gray-300";

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!validateInput()) return;

    setIsLoading(true);
    const res = await signIn("credentials", { redirect: false, email, password });
    setIsLoading(false);

    if (res?.error) setErrorMessage("Email hoac mat khau khong dung");
    else router.push("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
    setIsLoading(false);
  };

  const onPasswordKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsOn(event.getModifierState && event.getModifierState("CapsLock"));
  };

  useEffect(() => {
    const saved = localStorage.getItem("lf_email");
    if (saved) setEmail(saved);
  }, []);

  useEffect(() => {
    if (remember) localStorage.setItem("lf_email", email);
  }, [email, remember]);

  return (
    <AuthPageShell
      stageRef={stageRef}
      onMouseMove={handleMouseMove}
      variant="blue"
      hero={
        <>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-white dark:via-blue-300 dark:to-indigo-300"
          >
            Daily Focus
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 max-w-md text-lg text-gray-700/80 dark:text-gray-300"
          >
            Bot nhieu hon. Tap trung hon. Mot khong gian gon gang de ban hoan thanh dieu quan
            trong moi ngay.
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
            Chao mung tro lai
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Dang nhap de tiep tuc</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Mat khau
              </label>
              {capsOn && (
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
                onKeyUp={onPasswordKeyUp}
                placeholder="Nhap mat khau"
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-3 pr-16 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
                aria-label={showPassword ? "An mat khau" : "Hien mat khau"}
              >
                {showPassword ? "An" : "Hien"}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Do manh:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{strengthLabel}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-2 ${strengthClass} rounded-full transition-all duration-300`}
                  style={{ width: pwMax ? `${(pwScore / pwMax) * 100}%` : "0%" }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Goi y: toi thieu 8 ky tu, so, chu hoa, ky tu dac biet</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Ghi nho dang nhap
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Bang viec dang nhap ban dong y voi{" "}
              <Link href="/terms" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Dieu khoan
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Bao mat
              </Link>
            </span>
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
            {isLoading ? "Dang dang nhap..." : "Dang nhap"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-gray-200 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white/80 dark:bg-white/5 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 backdrop-blur-sm">
              hoac tiep tuc voi
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="w-full inline-flex items-center justify-center rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 font-semibold text-gray-800 dark:text-gray-100 transition hover:bg-gray-50 dark:hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-gray-300/40 disabled:opacity-60"
        >
          Dang nhap voi Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Chua co tai khoan?{" "}
          <Link href="/auth/register" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Dang ky ngay
          </Link>
        </p>
      </motion.div>
    </AuthPageShell>
  );
}
