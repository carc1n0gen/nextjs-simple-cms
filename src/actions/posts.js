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

  let post;
  const fields = {
    slug: validatedFields.data.slug,
    title: validatedFields.data.title,
    tags: validatedFields.data.tags.trim().split(" "),
    excerpt: validatedFields.data.excerpt,
    content: validatedFields.data.content,
  };
  if (validatedFields.data.postId) {
    post = Posts.update(validatedFields.data.postId, {
      ...fields,
      updatedAt: new Date(),
    });
  } else {
    post = Posts.insert({
      ...fields,
      userId: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return redirect("/dashboard");
}

export async function deletePost(formData) {
  if (!isAuthenticated()) {
    return redirect("/signin");
  }

  Posts.delete(formData.get("postId"));
  return redirect("/dashboard");
}
