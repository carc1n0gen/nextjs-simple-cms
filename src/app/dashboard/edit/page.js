import Link from "next/link";
import { redirect } from "next/navigation";

import { Posts } from "@/lib/database";
import EditForm from "@/components/forms/EditForm";
import Badge from "@/components/ui/Badge";
import { isAuthenticated } from "@/lib/authorization";

export default async function EditPost({ searchParams }) {
  if (!(await isAuthenticated())) {
    return redirect("/signin");
  }

  const { postId = "" } = await searchParams;
  const post = Posts.findById(postId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 no-underline hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50"
          >
            ← Back to dashboard
          </Link>
          <div className="mt-5">
            <Badge>{post ? "Editing" : "New post"}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
            {post ? "Edit post" : "Create post"}
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
            Write the details, preview the generated slug, and save your
            content.
          </p>
        </div>
      </div>

      <EditForm post={post} />
    </div>
  );
}
