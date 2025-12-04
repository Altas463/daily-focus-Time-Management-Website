'use client';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ArrowRight, CheckCircle2, CircleAlert, Eye, EyeOff, Loader2, Lock, Mail, Target, UserRound } from "lucide-react";
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

  const motivationTip = useMemo(
    () => getMotivationTip(new Date().setHours(0, 0, 0, 0) + 1),
    []
  );

  useEffect(() => {
    const { score, maxScore } = calculatePasswordStrength(password, { includeLowercase: true });
    setPasswordScore(score);
    setPasswordMax(maxScore);
  }, [password]);

  const passwordStrengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const passwordStrengthColors = [
    "#ef4444", // Red
    "#f97316", // Orange
    "#eab308", // Yellow
    "#84cc16", // Lime
    "#22c55e", // Green
    "#3b82f6", // Blue
  ];

  const isPasswordMatching = confirmPassword.length > 0 && password === confirmPassword;
  const ConfirmIcon = confirmPassword.length === 0 ? Lock : isPasswordMatching ? CheckCircle2 : CircleAlert;

  const validateInput = () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return false;
    }
    if (name.trim().length < 2) {
      setErrorMessage("Name must be at least 2 characters");
      return false;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Invalid email");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
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
        setErrorMessage(errorData.error || "Registration failed. Please try again");
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
          console.error("Unable to decode token:", error);
        }
      }

      setIsLoading(false);
      router.push("/auth/login");
    } catch (error) {
      console.error("Connection error:", error);
      setErrorMessage("Unable to connect to server");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-base text-foreground font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-slate-900 text-white">
        {/* Technical Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Daily Focus</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-1 bg-primary mb-6" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
              Initiate New<br />User Protocol
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-slate-400 max-w-md font-mono"
          >
            {"// Join the network. Optimize your workflow. Execute with precision."}
          </motion.p>
        </div>

        <div className="relative z-10 text-slate-500 text-xs font-mono">
          SYSTEM_ID: DF-2024-V2 // REGISTRATION_MODULE
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-base overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Daily Focus</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-mono font-bold rounded-sm mb-4">
              NEW_USER_REGISTRATION
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-slate-500">Configure your profile to access the system</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5" noValidate>
            {/* Name field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-surface-panel border border-border-default rounded-sm text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3 bg-surface-panel border border-border-default rounded-sm text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                {capsOnPw && (
                  <span className="text-xs font-bold text-primary animate-pulse">
                    CAPS LOCK ON
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => setCapsOnPw(e.getModifierState && e.getModifierState("CapsLock"))}
                  placeholder="Create password"
                  className="w-full pl-12 pr-12 py-3 bg-surface-panel border border-border-default rounded-sm text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Strength Meter */}
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full"
                      initial={{ width: 0 }}
                      animate={{ width: passwordMax ? `${(passwordScore / passwordMax) * 100}%` : "0%" }}
                      style={{ background: passwordStrengthColors[passwordScore] }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] uppercase font-mono">
                    <span style={{ color: passwordStrengthColors[passwordScore] }}>
                      {passwordStrengthLabel[passwordScore]}
                    </span>
                    <span className="text-slate-400">MIN 8 CHARS</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                {capsOnConfirm && (
                  <span className="text-xs font-bold text-primary animate-pulse">
                    CAPS LOCK ON
                  </span>
                )}
              </div>
              <div className="relative">
                <ConfirmIcon
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    confirmPassword.length === 0 ? "text-slate-400" : isPasswordMatching ? "text-green-500" : "text-red-500"
                  }`}
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyUp={(e) => setCapsOnConfirm(e.getModifierState && e.getModifierState("CapsLock"))}
                  placeholder="Confirm password"
                  className={`w-full pl-12 pr-12 py-3 bg-surface-panel border rounded-sm text-sm focus:ring-1 outline-none transition-all ${
                    confirmPassword.length > 0 && !isPasswordMatching 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                      : "border-border-default focus:border-primary focus:ring-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-tech-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  REGISTERING...
                </>
              ) : (
                <>
                  CREATE ACCOUNT
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>

          {/* Tip */}
          <div className="p-4 bg-surface-panel border border-border-default rounded-sm">
            <p className="text-xs font-mono text-slate-500">
              <span className="font-bold text-primary">TIP_OF_DAY:</span> {motivationTip}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
