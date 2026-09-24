import "server-only";

import { z } from "zod/v4";
import { Users } from "./database";

export const SignupFormSchema = z.object({
  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters long."),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .refine((value) => {
      return !Users.find((user) => user.username === value);
    }, "Username is already in use."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export const SigninFormSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export const PostFormSchema = z.object({
  postId: z.string().optional(),
  slug: z.string().min(1, "Slug is required."),
  title: z.string().min(1, "Title is required."),
  excerpt: z.string().min(1),
  tags: z.string().optional(),
  content: z.string().optional(),
});
