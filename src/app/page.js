import Link from "next/link";

import { Posts } from "@/lib/database";
import Badge from "@/components/ui/Badge";
import BlogLayout from "@/components/BlogLayout";

export default function Blog() {
  const posts = Posts.sortedBy("createdAt");

  return (
    <BlogLayout>
      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50">
            No posts yet
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Check back soon for new writing.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => {
            const createdAt = new Date(post.createdAt);
            const year = createdAt.getFullYear();
            const month = String(createdAt.getMonth() + 1).padStart(2, "0");
            const day = String(createdAt.getDate()).padStart(2, "0");
            const url = `/${year}/${month}/${day}/${post.slug}`;

            return (
              <article
                key={post._id}
                className="rounded-3xl border border-gray-200 p-6 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-950 sm:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-2xl">
                    <Link href={url} className="no-underline hover:underline">
                      <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-3 leading-7 text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>
                    <Link
                      href={url}
                      className="mt-4 inline-flex text-sm font-medium text-gray-950 no-underline hover:underline dark:text-gray-50"
                    >
                      Continue reading →
                    </Link>
                  </div>
                  <time className="shrink-0 text-sm text-gray-500 dark:text-gray-500">
                    {createdAt.toLocaleDateString()}
                  </time>
                </div>

                {post.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </BlogLayout>
  );
}
