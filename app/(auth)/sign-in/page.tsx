"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";
import { EyeIcon, EyeOffIcon } from "../../../components/icons/Icons";

type FieldErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getRedirectDestination(redirectTo: string | null) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/";
  }

  try {
    const destination = new URL(redirectTo, window.location.origin);
    if (destination.origin === window.location.origin) {
      return `${destination.pathname}${destination.search}${destination.hash}`;
    }
  } catch {
    return "/";
  }

  return "/";
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Unable to sign in. Please check your details.");
        return;
      }

      const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
      router.replace(getRedirectDestination(redirectTo));
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: getRedirectDestination(redirectTo),
        errorCallbackURL: "/sign-in",
      });

      if (error) {
        setErrorMessage(error.message || "Unable to sign in with Google.");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in with Google.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-lg sm:p-9">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#2563EB]"
        >
          <span aria-hidden="true">←</span> FIXORA
        </Link>
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#172B4D]">
            Sign in to FIXORA
          </h1>
          <p className="mt-2 text-sm text-[#737B87]">
            Access your account and manage your FIXORA services.
          </p>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-[#172B4D]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-3 text-sm text-[#172B4D] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-[#172B4D]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-3 pr-11 text-sm text-[#172B4D] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#737B87] hover:text-[#172B4D]"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-xs text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-[#737B87]">
          <span className="h-px flex-1 bg-[#E5E7EB]" />
          or continue with
          <span className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#172B4D] transition-colors hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span aria-hidden="true" className="text-base font-bold text-[#4285F4]">
            G
          </span>
          {isSubmitting ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-[#737B87]">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-[#2563EB] hover:underline">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
