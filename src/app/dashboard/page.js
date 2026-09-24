import Link from "next/link";

import { Posts } from "@/lib/database";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DeletePostButton from "@/components/DeletePostButton";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export default async function Dashboard() {
  const posts = Posts.sortedBy("createdAt");
  const latestPost = Posts.sortedBy("updatedAt")[0];
  const tagCount = new Set(posts.flatMap((post) => post.tags ?? [])).size;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge>CMS overview</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
            Manage your content
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
            Create, edit, and publish posts from one focused workspace.
          </p>
        </div>
        <Button as={Link} href="/dashboard/edit" size="lg">
          New post
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Posts
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
            {posts.length}
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Tags
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
            {tagCount}
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Latest update
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
            {formatDate(latestPost?.updatedAt)}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5 dark:border-gray-900">
          <div>
            <h2 className="font-semibold text-gray-950 dark:text-gray-50">
              Posts
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Recent content in your CMS.
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-medium text-gray-950 dark:text-gray-50">
              No posts yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Create your first post to see it here.
            </p>
            <Button as={Link} href="/dashboard/edit" className="mt-6">
              Create post
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 dark:text-gray-400">
                <tr className="border-b border-gray-100 dark:border-gray-900">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Tags</th>
                  <th className="px-6 py-3 font-medium">Updated</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-950"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/edit?postId=${post._id}`}
                        className="font-medium text-gray-950 no-underline hover:underline dark:text-gray-50"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {(post.tags ?? []).slice(0, 3).map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                        {(post.tags ?? []).length > 3 && (
                          <Badge>+{post.tags.length - 3}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(post.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          as={Link}
                          href={`/dashboard/edit?postId=${post._id}`}
                          variant="secondary"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <DeletePostButton
                          postId={post._id}
                          postTitle={post.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
