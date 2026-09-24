"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signin } from "@/actions/auth";
import Button from "@/components/ui/Button";
import CustomCard from "@/components/CustomCard";
import LabelAndInput from "@/components/LabelAndInput";

export default function SigninForm() {
  const [state, action, isPending] = useActionState(signin);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 no-underline hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50"
          >
            NextJS Simple CMS
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
            Welcome back
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to manage your site.
          </p>
        </div>

        <CustomCard as="form" action={action}>
          {{
            body: (
              <div className="space-y-5">
                {state?.errors?.page && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                    {state.errors.page}
                  </p>
                )}

                <LabelAndInput
                  id="username"
                  name="username"
                  label="Username"
                  type="text"
                  defaultValue={state?.previousValues?.username}
                  errors={state?.errors?.username}
                />

                <LabelAndInput
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  errors={state?.errors?.password}
                />

                <Button className="w-full" type="submit" disabled={isPending}>
                  Sign in
                </Button>
              </div>
            ),
            footer: (
              <span>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-gray-950 dark:text-gray-50"
                >
                  Sign up
                </Link>
              </span>
            ),
          }}
        </CustomCard>
      </div>
    </main>
  );
}
