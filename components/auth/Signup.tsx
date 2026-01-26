"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupAction } from "@/actions/auth";

export default function Page() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signupAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/login");
    }
  }, [state, router]);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="EduTIA" src="/logo/blue.svg" className="mx-auto h-8 w-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign up an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eduBlue sm:text-sm/6"
            />
          </div>

          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eduBlue sm:text-sm/6"
            />
          </div>

          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Password Confirmation
            </label>
            <input
              name="passwordConfirmation"
              type="password"
              required
              placeholder="Reenter your password"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eduBlue sm:text-sm/6"
            />
          </div>

          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              What do you want to do?
            </label>
            <select
              name="role"
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eduBlue sm:text-sm/6"
            >
              <option value="EDUCATEE">I want to improve my skills</option>
              <option value="COMPANY">
                I want to hire talented individuals
              </option>
            </select>
          </div>

          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full justify-center rounded-md bg-eduBlue px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-eduBlue/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eduBlue"
          >
            {isPending ? "Signing up..." : "Sign up"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-black shadow-x focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
          >
            Continue as Guest
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-eduBlue hover:text-eduBlue/90"
          >
            Log in now
          </Link>
        </p>
      </div>
    </div>
  );
}
