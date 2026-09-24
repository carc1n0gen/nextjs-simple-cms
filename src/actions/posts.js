"use server";

import { flattenError } from "zod/v4";
import { redirect } from "next/navigation";

import { Posts } from "@/lib/database";
import { PostFormSchema } from "@/lib/formSchemas";
import { getAuthenticatedUser, isAuthenticated } from "@/lib/authorization";

export async function savePost(currentState, formData) {
  const user = await getAuthenticatedUser();

  const validatedFields = PostFormSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!validatedFields.success) {
    return {
      previousValues: Object.fromEntries(formData),
      errors: flattenError(validatedFields.error).fieldErrors,
    };
  }

  const fields = {
    slug: validatedFields.data.slug,
    title: validatedFields.data.title,
    tags: (validatedFields.data.tags ?? "").trim().split(/\s+/).filter(Boolean),
    excerpt: validatedFields.data.excerpt,
    content: validatedFields.data.content,
  };
  if (validatedFields.data.postId) {
    Posts.update(validatedFields.data.postId, fields);
  } else {
    Posts.insert({ ...fields, userId: user._id });
  }

  return redirect("/dashboard");
}

export async function deletePost(formData) {
  if (!(await isAuthenticated())) {
    return redirect("/signin");
  }

  Posts.remove(formData.get("postId"));
  return redirect("/dashboard");
}
