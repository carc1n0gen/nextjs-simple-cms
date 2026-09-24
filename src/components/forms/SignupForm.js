"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup } from "@/actions/auth";
import Button from "@/components/ui/Button";
import CustomCard from "@/components/CustomCard";
import LabelAndInput from "@/components/LabelAndInput";

export default function SignupForm() {
  const [state, action, isPending] = useActionState(signup);

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
            Create your account
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Start publishing from a clean CMS workspace.
          </p>
        </div>

        <CustomCard as="form" action={action}>
          {{
            body: (
              <div className="space-y-5">
                <LabelAndInput
                  id="displayName"
                  name="displayName"
                  label="Display name"
                  type="text"
                  defaultValue={state?.previousValues?.displayName}
                  errors={state?.errors?.displayName}
                />

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

                <Button type="submit" className="w-full" disabled={isPending}>
                  Sign up
                </Button>
              </div>
            ),
            footer: (
              <span>
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-gray-950 dark:text-gray-50"
                >
                  Sign in
                </Link>
              </span>
            ),
          }}
        </CustomCard>
      </div>
    </main>
  );
}
