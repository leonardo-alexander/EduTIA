"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/actions/auth";

export default function Login() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (!state?.success) return;

    if (state.role === "ADMIN") {
      router.push("/admin");
    } else if (state.status) {
      router.push("/profile?edit=true");
    } else {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-3">
          <img src="/logo/blue.svg" alt="EduTIA" className="mx-auto h-10" />
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Log in to continue your journey
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-eduBlue focus:outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-gray-700">Password</label>
              <Link
                href="/forgot-password"
                className="text-eduBlue hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-eduBlue focus:outline-none transition"
            />
          </div>

          {state?.error && (
            <div className="text-sm text-red-600 text-center">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-eduBlue text-white py-2.5 rounded-lg font-semibold hover:bg-eduBlue/90 transition disabled:opacity-50"
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Continue as Guest
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-eduBlue hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
