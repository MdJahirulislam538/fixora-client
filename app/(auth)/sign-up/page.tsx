"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "../../lib/auth-client";
import { EyeIcon, EyeOffIcon } from "../../../components/icons/Icons";

type SignUpRole = "customer" | "technician";
type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<SignUpRole>("customer");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (!name.trim()) nextErrors.name = "Full name is required.";
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!validate()) {
      toast.error("Check the highlighted sign-up fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        callbackURL: "/",
      });

      if (error) {
        const message = error.message || "Unable to create your account. Please try again.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSuccessMessage(
        `Your ${role} account was created and saved. You are now signed in.`,
      );
      toast.success("Your account is ready.");
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Unable to create your account. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        newUserCallbackURL: "/",
        errorCallbackURL: "/sign-up",
        requestSignUp: true,
        additionalData: { role },
      });

      if (error) {
        const message = error.message || "Unable to sign up with Google.";
        setErrorMessage(message);
        toast.error(message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign up with Google.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-lg sm:p-9">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#2563EB]"
        >
          <span aria-hidden="true">←</span> FIXORA
        </Link>

        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
            Get started
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#172B4D]">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[#737B87]">
            Join FIXORA to book repairs or offer your technician services.
          </p>
        </div>

        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-semibold text-[#172B4D]">
            I want to join as a
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {(["customer", "technician"] as const).map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-3.5 text-sm font-medium capitalize transition-colors ${
                  role === option
                    ? "border-[#2563EB] bg-blue-50 text-[#172B4D]"
                    : "border-[#E5E7EB] text-[#454B54] hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option}
                  checked={role === option}
                  onChange={() => setRole(option)}
                  className="accent-[#2563EB]"
                  disabled={isSubmitting}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <div
            role="status"
            className="mb-5 rounded-lg bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800"
          >
            <p>{successMessage}</p>
            <Link href="/" className="mt-2 inline-block font-semibold underline">
              Continue to FIXORA
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="full-name"
              className="mb-1.5 block text-sm font-semibold text-[#172B4D]"
            >
              Full Name
            </label>
            <input
              id="full-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-3 text-sm text-[#172B4D] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              placeholder="Your full name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-600">
                {errors.name}
              </p>
            )}
          </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : "password-hint"}
                className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-3 pr-11 text-sm text-[#172B4D] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                placeholder="At least 8 characters"
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
            {errors.password ? (
              <p id="password-error" className="mt-1.5 text-xs text-red-600">
                {errors.password}
              </p>
            ) : (
              <p id="password-hint" className="mt-1.5 text-xs text-[#737B87]">
                Use at least 8 characters.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-semibold text-[#172B4D]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-3 pr-11 text-sm text-[#172B4D] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                placeholder="Enter your password again"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={
                  showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                }
                aria-pressed={showConfirmPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#737B87] hover:text-[#172B4D]"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="mt-1.5 text-xs text-red-600"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-[#737B87]">
          <span className="h-px flex-1 bg-[#E5E7EB]" />
          or continue with
          <span className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#172B4D] transition-colors hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span aria-hidden="true" className="text-base font-bold text-[#4285F4]">
            G
          </span>
          {isSubmitting ? "Connecting to Google..." : "Sign up with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-[#737B87]">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-[#2563EB] hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
