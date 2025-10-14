'use client';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ArrowRight, CheckCircle2, CircleAlert, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
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

  const passwordStrengthLabel = ["Rat yeu", "Yeu", "Trung binh", "Kha", "Manh", "Rat manh"];
  const passwordStrengthClass =
    [
      "bg-gradient-to-r from-rose-500 to-orange-400",
      "bg-gradient-to-r from-orange-400 to-amber-400",
      "bg-gradient-to-r from-amber-400 to-yellow-400",
      "bg-gradient-to-r from-lime-400 to-emerald-400",
      "bg-gradient-to-r from-emerald-400 to-teal-500",
      "bg-gradient-to-r from-teal-500 to-sky-500",
    ][passwordScore] || "bg-gray-300";
  const isPasswordMatching = confirmPassword.length > 0 && password === confirmPassword;
  const ConfirmIcon = confirmPassword.length === 0 ? Lock : isPasswordMatching ? CheckCircle2 : CircleAlert;
  const confirmIconTone =
    confirmPassword.length === 0
      ? "text-gray-400 dark:text-gray-500"
      : isPasswordMatching
        ? "text-emerald-500 dark:text-emerald-400"
        : "text-red-500 dark:text-red-400";

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
      variant="emerald"
      hero={
        <>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white shadow-lg"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            <span>Mo khoa tiem nang ban</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white"
          >
            Bat dau hanh trinh tap trung
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="mt-6 max-w-md text-base text-gray-600 dark:text-gray-300"
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
        className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 px-6 py-8 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:bg-gray-950/75 sm:px-10 sm:py-12"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-32 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-800/40" />
          <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-white/70 blur-[120px] dark:bg-white/10" />
        </div>
        <div className="relative">
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              <span>An toan & nhanh chong</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Tao tai khoan
            </h1>
            <p className="max-w-sm text-sm text-gray-600 dark:text-gray-300">
              Chi mat vai phut de bat dau nang suat hon.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Ten
              </label>
              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  aria-hidden
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nguyen Van A"
                  className="w-full rounded-2xl border border-emerald-200/60 bg-white/90 px-4 py-3 pl-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-gray-900/70 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-300 dark:focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  aria-hidden
                />
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-emerald-200/60 bg-white/90 px-4 py-3 pl-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-gray-900/70 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-300 dark:focus:ring-emerald-500/20"
                />
              </div>
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
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  aria-hidden
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyUp={(event) => setCapsOnPw(event.getModifierState && event.getModifierState("CapsLock"))}
                  placeholder="Nhap mat khau"
                  className="w-full rounded-2xl border border-emerald-200/60 bg-white/90 px-4 py-3 pl-12 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-gray-900/70 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-300 dark:focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200"
                  aria-label={showPassword ? "An mat khau" : "Hien mat khau"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                  <span className="sr-only">{showPassword ? "An mat khau" : "Hien mat khau"}</span>
                </button>
              </div>

              {password && (
                <div className="space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100/70 dark:bg-white/10">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrengthClass}`}
                      style={{ width: passwordMax ? `${(passwordScore / passwordMax) * 100}%` : "0%" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Do manh:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {passwordStrengthLabel[passwordScore] || ""}
                      </span>
                    </span>
                    <span>Goi y: 8 ky tu, chu hoa/thuong, so, ky tu dac biet</span>
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
                <ConfirmIcon
                  className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${confirmIconTone}`}
                  aria-hidden
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  onKeyUp={(event) => setCapsOnConfirm(event.getModifierState && event.getModifierState("CapsLock"))}
                  placeholder="Nhap lai mat khau"
                  className="w-full rounded-2xl border border-emerald-200/60 bg-white/90 px-4 py-3 pl-12 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-gray-900/70 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-300 dark:focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200"
                  aria-label={showConfirmPassword ? "An mat khau xac nhan" : "Hien mat khau xac nhan"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                  <span className="sr-only">{showConfirmPassword ? "An mat khau xac nhan" : "Hien mat khau xac nhan"}</span>
                </button>
              </div>
              {confirmPassword && (
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    isPasswordMatching
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {isPasswordMatching ? (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <CircleAlert className="h-3.5 w-3.5" aria-hidden />
                  )}
                  <span>{isPasswordMatching ? "Mat khau khop" : "Mat khau khong khop"}</span>
                </div>
              )}
            </div>

            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-2xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-emerald-400 hover:to-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:opacity-60 dark:text-gray-900"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Dang tao tai khoan...
                </>
              ) : (
                <>
                  Tao tai khoan
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-dashed border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
            Meo nho: {motivationTip}
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Da co tai khoan?{" "}
            <Link href="/auth/login" className="font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-300">
              Dang nhap ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthPageShell>
  );
}
