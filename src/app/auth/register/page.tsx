'use client';
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ArrowRight, CheckCircle2, CircleAlert, Eye, EyeOff, Loader2, Lock, Mail, Rocket, Sparkles, UserRound } from "lucide-react";
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
    "#ef4444", // Very Weak - red
    "#f97316", // Weak - orange
    "#eab308", // Fair - yellow
    "#84cc16", // Good - lime
    "#22c55e", // Strong - green
    "#10b981", // Very Strong - emerald
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
    <div
      className="min-h-screen flex"
      style={{ background: "var(--background)" }}
    >
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)" }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Daily Focus</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white leading-tight"
          >
            Start your<br />productivity journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/80 max-w-md"
          >
            Join thousands of users who have transformed their daily routines with Daily Focus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {[
              { icon: "✓", text: "Track tasks & projects effortlessly" },
              { icon: "✓", text: "Pomodoro timer for deep focus" },
              { icon: "✓", text: "Detailed productivity insights" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                  {item.icon}
                </div>
                <span className="text-white/90">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          &copy; {new Date().getFullYear()} Daily Focus. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Daily Focus
            </span>
          </div>

          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
              }}
            >
              <Rocket className="w-3.5 h-3.5" />
              Get started free
            </div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Create your account
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Start your productivity journey today
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            {/* Name field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Full Name
              </label>
              <div className="relative">
                <UserRound
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none"
                  style={{
                    background: "var(--surface-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none"
                  style={{
                    background: "var(--surface-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Password
                </label>
                {capsOnPw && (
                  <span className="text-xs font-medium" style={{ color: "#f59e0b" }}>
                    Caps Lock is on
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => setCapsOnPw(e.getModifierState && e.getModifierState("CapsLock"))}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none"
                  style={{
                    background: "var(--surface-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "var(--text-muted)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--border)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: passwordMax ? `${(passwordScore / passwordMax) * 100}%` : "0%",
                      }}
                      style={{ background: passwordStrengthColors[passwordScore] }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: passwordStrengthColors[passwordScore] }}>
                      {passwordStrengthLabel[passwordScore] || ""}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      Min 8 characters
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Confirm Password
                </label>
                {capsOnConfirm && (
                  <span className="text-xs font-medium" style={{ color: "#f59e0b" }}>
                    Caps Lock is on
                  </span>
                )}
              </div>
              <div className="relative">
                <ConfirmIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{
                    color: confirmPassword.length === 0
                      ? "var(--text-muted)"
                      : isPasswordMatching
                        ? "#22c55e"
                        : "#ef4444"
                  }}
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyUp={(e) => setCapsOnConfirm(e.getModifierState && e.getModifierState("CapsLock"))}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none"
                  style={{
                    background: "var(--surface-secondary)",
                    border: `1px solid ${
                      confirmPassword.length === 0
                        ? "var(--border)"
                        : isPasswordMatching
                          ? "rgba(34, 197, 94, 0.5)"
                          : "rgba(239, 68, 68, 0.5)"
                    }`,
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "var(--text-muted)" }}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password match indicator */}
              {confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs font-medium"
                  style={{
                    color: isPasswordMatching ? "#22c55e" : "#ef4444",
                  }}
                >
                  {isPasswordMatching ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <CircleAlert className="w-3.5 h-3.5" />
                      Passwords do not match
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Terms */}
            <div
              className="p-4 rounded-xl text-xs"
              style={{
                background: "var(--surface-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline" style={{ color: "var(--primary)" }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline" style={{ color: "var(--primary)" }}>
                Privacy Policy
              </Link>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl text-sm"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "#ef4444",
                  }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Tip */}
          <div
            className="mt-6 p-4 rounded-xl"
            style={{
              background: "rgba(16, 185, 129, 0.05)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              <span className="font-semibold" style={{ color: "#10b981" }}>Tip:</span> {motivationTip}
            </p>
          </div>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold"
              style={{ color: "var(--primary)" }}
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
