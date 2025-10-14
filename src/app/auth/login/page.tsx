'use client';
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import AuthPageShell from "@/components/auth/AuthPageShell";
import { useSpotlightStage } from "@/hooks/useSpotlightStage";
import { calculatePasswordStrength } from "@/utils/password";
import { getMotivationTip } from "@/utils/motivation";
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
  const motivationTip = useMemo(
    () => getMotivationTip(new Date().setHours(0, 0, 0, 0)),
    []
  );
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
    [
      "bg-gradient-to-r from-rose-500 to-orange-400",
      "bg-gradient-to-r from-orange-400 to-amber-400",
      "bg-gradient-to-r from-amber-400 to-yellow-400",
      "bg-gradient-to-r from-lime-400 to-emerald-400",
      "bg-gradient-to-r from-emerald-400 to-teal-500",
    ][pwScore] || "bg-gray-300";
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
      variant="slate"
      hero={
        <>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg dark:bg-emerald-500/90"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            <span>Khoi dong ngay hieu qua</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white"
          >
            Daily Focus
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="mt-6 max-w-md text-base text-gray-600 dark:text-gray-300"
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
        className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 px-6 py-8 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:bg-gray-950/75 sm:px-10 sm:py-12"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-32 h-72 w-72 rounded-full bg-blue-200/60 blur-3xl dark:bg-emerald-700/30" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/70 blur-[120px] dark:bg-white/10" />
        </div>
        <div className="relative">
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-100/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              <span>Dang nhap an toan</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Chao mung tro lai
            </h1>
            <p className="max-w-sm text-sm text-gray-600 dark:text-gray-300">
              Dang nhap de tiep tuc nhung muc tieu da dat ra.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
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
                  className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 pl-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition focus:border-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-400/20 dark:border-white/10 dark:bg-gray-900/70 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                />
              </div>
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
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  aria-hidden
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyUp={onPasswordKeyUp}
                  placeholder="Nhap mat khau"
                  className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 pl-12 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition focus:border-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-400/20 dark:border-white/10 dark:bg-gray-900/70 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Do manh:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{strengthLabel}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${strengthClass}`}
                    style={{ width: pwMax ? `${(pwScore / pwMax) * 100}%` : "0%" }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Goi y: toi thieu 8 ky tu, so, chu hoa, ky tu dac biet
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/60 px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-400 dark:border-white/20 dark:bg-transparent dark:text-emerald-400 dark:focus:ring-emerald-400"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Ghi nho dang nhap
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Bang viec dang nhap ban dong y voi{" "}
                <Link href="/terms" className="font-medium text-slate-700 underline-offset-4 hover:underline dark:text-emerald-300">
                  Dieu khoan
                </Link>{" "}
                &{" "}
                <Link href="/privacy" className="font-medium text-slate-700 underline-offset-4 hover:underline dark:text-emerald-300">
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
                  className="rounded-2xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-slate-800 hover:to-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-60 dark:from-emerald-400 dark:via-emerald-500 dark:to-emerald-400 dark:text-gray-900 dark:hover:from-emerald-300 dark:hover:to-emerald-400 dark:focus-visible:outline-emerald-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Dang dang nhap...
                </>
              ) : (
                <>
                  Dang nhap
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
            <span
              className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/70 to-transparent dark:via-white/10"
              aria-hidden
            />
            <span>Hoac tiep tuc</span>
            <span
              className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/70 to-transparent dark:via-white/10"
              aria-hidden
            />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            type="button"
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-slate-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-60 dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-white/20 dark:hover:bg-gray-900"
          >
            <span
              aria-hidden
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#FBBC05] text-xs font-black text-white shadow-sm"
            >
              G
            </span>
            Dang nhap voi Google
          </button>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/70 px-4 py-3 text-xs text-gray-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
            Meo nho: {motivationTip}
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Chua co tai khoan?{" "}
            <Link href="/auth/register" className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-emerald-300">
              Dang ky ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthPageShell>
  );
}

