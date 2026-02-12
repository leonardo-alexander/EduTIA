"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupAction } from "@/actions/auth";

export default function Signup() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signupAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/login");
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <img src="/logo/blue.svg" alt="EduTIA" className="mx-auto h-10" />
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-500">
              Start your journey with EduTIA
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
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Create a password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-eduBlue focus:outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                name="passwordConfirmation"
                type="password"
                required
                placeholder="Reenter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-eduBlue focus:outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                I want to...
              </label>
              <select
                name="role"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-eduBlue focus:outline-none transition"
              >
                <option value="EDUCATEE">Improve my skills</option>
                <option value="COMPANY">Hire talented individuals</option>
              </select>
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
              {isPending ? "Signing up..." : "Sign up"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Continue as Guest
            </button>
          </form>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-eduBlue hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
