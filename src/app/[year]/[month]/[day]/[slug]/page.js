import { notFound } from "next/navigation";
import Link from "next/link";

import { Posts } from "@/lib/database";
import Badge from "@/components/ui/Badge";
import BlogLayout from "@/components/BlogLayout";

export default async function ShowPost({ params }) {
  const { slug } = await params;
  const post = Posts.find((candidate) => candidate.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogLayout>
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 no-underline hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50"
        >
          ← Back to all posts
        </Link>

        <header className="mt-8 border-b border-gray-200 pb-8 dark:border-gray-800">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-gray-950 dark:text-gray-50 sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
            Published {new Date(post.createdAt).toLocaleDateString()} · Updated{" "}
            {new Date(post.updatedAt).toLocaleDateString()}
          </p>
        </header>

        <section
          className="rich-content mt-10 text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </BlogLayout>
  );
}
