"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import dispatchWhite from "@/assets/dispatch-white.png";
import dispatchBlack from "@/assets/dispatch-black.png";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/intl";
import { useAuth } from "@/context/AuthContext";
import { login as keycloakLogin, type AuthError } from "@/lib/auth";
import { useTheme } from "next-themes";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

function getAttemptKey() {
  return `dispatch_login_attempts_admin`;
}

function getAttemptData(): { count: number; firstAttemptAt: number } {
  try {
    const raw = sessionStorage.getItem(getAttemptKey());
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, firstAttemptAt: 0 };
}

function setAttemptData(data: { count: number; firstAttemptAt: number }) {
  sessionStorage.setItem(getAttemptKey(), JSON.stringify(data));
}

function clearAttemptData() {
  sessionStorage.removeItem(getAttemptKey());
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { setTokens, isAuthenticated } = useAuth();
  const hasRedirected = useRef(false);

  const t = useI18n("login");
  const roleLabel = t(`roles.admin.label`);
  const roleSubtitle = t(`roles.admin.subtitle`);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLogo =
    mounted && resolvedTheme === "dark" ? dispatchBlack : dispatchWhite;

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  useEffect(() => {
    if (isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/admin");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    checkLockout();
  }, []);

  useEffect(() => {
    if (!isLockedOut) return;
    const interval = setInterval(() => {
      checkLockout();
    }, 1000);
    return () => clearInterval(interval);
  }, [isLockedOut]);

  function checkLockout() {
    const data = getAttemptData();
    if (data.count >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - data.firstAttemptAt;
      if (elapsed < LOCKOUT_DURATION_MS) {
        setIsLockedOut(true);
        setLockoutRemaining(Math.ceil((LOCKOUT_DURATION_MS - elapsed) / 1000));
        return;
      }
      clearAttemptData();
    }
    setIsLockedOut(false);
    setLockoutRemaining(0);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function validateUsername(val: string): string | null {
    if (!val.trim()) return t("validation.usernameRequired");
    return null;
  }

  function validatePassword(val: string): string | null {
    if (!val) return t("validation.passwordRequired");
    if (val.length < 5) return t("validation.passwordTooShort");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isLockedOut) return;

    const userErr = validateUsername(username);
    const passwordErr = validatePassword(password);
    setFieldErrors({
      username: userErr ?? undefined,
      password: passwordErr ?? undefined,
    });
    if (userErr || passwordErr) return;

    setIsLoading(true);
    try {
      const tokens = await keycloakLogin(username, password, "admin");
      clearAttemptData();
      setTokens(tokens);
      toast.success(t("loginSuccess"), {
        description: t("redirecting"),
      });
      setTimeout(() => router.push("/admin"), 1000);
    } catch (err) {
      const authErr = err as AuthError;
      const msg = authErr.message;

      if (
        msg.toLowerCase().includes("user") ||
        msg.toLowerCase().includes("account")
      ) {
        setFieldErrors({ username: msg });
      } else if (
        msg.toLowerCase().includes("password") ||
        msg.toLowerCase().includes("credentials")
      ) {
        setFieldErrors({ password: msg });
      } else {
        setError(msg);
      }

      if (
        authErr.code === "INVALID_CREDENTIALS" ||
        msg.toLowerCase().includes("invalid")
      ) {
        const data = getAttemptData();
        const now = Date.now();
        if (
          data.count === 0 ||
          now - data.firstAttemptAt >= LOCKOUT_DURATION_MS
        ) {
          setAttemptData({ count: 1, firstAttemptAt: now });
        } else {
          setAttemptData({
            count: data.count + 1,
            firstAttemptAt: data.firstAttemptAt,
          });
        }
        checkLockout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel: branding */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative max-w-md text-center px-8">
          <img
            src={currentLogo.src}
            alt="Dispatch"
            className="h-28 w-auto mx-auto mb-10 drop-shadow-[0_0_30px_hsl(0,0%,50%,0.2)]"
          />
          <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
            {t("welcomeBack")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("platformDescription")}
          </p>
        </div>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Top bar: controls */}
        <div className="absolute top-5 right-6 flex items-center gap-0.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <img src={currentLogo.src} alt="Dispatch" className="h-20 w-auto" />
          </div>

          {/* Role header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {roleLabel}
              </h1>
              <p className="text-xs text-muted-foreground">{roleSubtitle}</p>
            </div>
          </div>

          {/* Notification area */}
          <div className="mb-6 overflow-hidden">
            {/* Error banner */}
            <div
              className={`flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 rounded-xl p-3.5 transition-all duration-200 ${
                error
                  ? "opacity-100 max-h-28"
                  : "opacity-0 max-h-0 p-0 border-0"
              }`}
            >
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>

            {/* Lockout banner */}
            <div
              className={`flex items-start gap-2.5 bg-warning/10 border border-warning/20 rounded-xl p-3.5 transition-all duration-200 ${
                isLockedOut
                  ? "opacity-100 max-h-28"
                  : "opacity-0 max-h-0 p-0 border-0"
              }`}
            >
              <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warning">
                {t("lockout.message", { time: formatTime(lockoutRemaining) })}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs text-muted-foreground"
              >
                {t("usernameLabel")}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={t("usernamePlaceholder")}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username)
                    setFieldErrors((p) => ({ ...p, username: undefined }));
                }}
                required
                disabled={isLockedOut || isLoading}
                className={`h-11 rounded-xl bg-card border-border/60 focus:border-primary/40 ${
                  fieldErrors.username
                    ? "border-destructive/60 focus:border-destructive/80"
                    : ""
                }`}
              />
              {fieldErrors.username && (
                <p className="text-xs text-destructive mt-1">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs text-muted-foreground"
              >
                {t("passwordLabel")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password)
                      setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  required
                  disabled={isLockedOut || isLoading}
                  className={`h-11 rounded-xl bg-card border-border/60 focus:border-primary/40 pr-10 ${
                    fieldErrors.password
                      ? "border-destructive/60 focus:border-destructive/80"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-destructive mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl"
              disabled={isLockedOut || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("signingIn")}
                </span>
              ) : (
                t("signIn")
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
