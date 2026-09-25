"use server";

import bcrypt from "bcrypt";
import { flattenError } from "zod/v4";
import { redirect } from "next/navigation";

import { SigninFormSchema, SignupFormSchema } from "@/lib/formSchemas";
import { Users } from "@/lib/database";
import { deleteSession, setSessionValue } from "@/lib/session";
import { isAuthenticated } from "@/lib/authorization";

function getSafePreviousValues(formData) {
  const { password, confirmPassword, ...rest } = Object.fromEntries(formData);
  return rest;
}

export async function signup(currentState, formData) {
  const validatedFields = SignupFormSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!validatedFields.success) {
    return {
      previousValues: getSafePreviousValues(formData),
      errors: flattenError(validatedFields.error).fieldErrors,
    };
  }

  Users.insert({
    displayName: validatedFields.data.displayName,
    username: validatedFields.data.username,
    password: bcrypt.hashSync(validatedFields.data.password, 10),
  });

  return redirect("/signin");
}

export async function signin(currentState, formData) {
  const validatedFields = SigninFormSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!validatedFields.success) {
    return {
      previousValues: getSafePreviousValues(formData),
      errors: flattenError(validatedFields.error).fieldErrors,
    };
  }

  const user = Users.query()
    .equalTo("username", validatedFields.data.username)
    .first();

  if (
    !user ||
    !bcrypt.compareSync(validatedFields.data.password, user.password)
  ) {
    return {
      previousValues: getSafePreviousValues(formData),
      errors: { page: "Invalid username or password." },
    };
  }

  await setSessionValue("userId", user._id);
  return redirect("/dashboard");
}

export async function signout() {
  if (!(await isAuthenticated())) {
    return redirect("/signin");
  }

  await deleteSession();
  redirect("/signin");
}
