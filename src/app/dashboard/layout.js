import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/lib/authorization";
import Container from "@/components/ui/Container";
import SignoutButton from "@/components/SignoutButton";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/edit", label: "New post" },
  { href: "/", label: "View site" },
];

export default async function DashboardLayout({ children }) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[17rem_1fr]">
        <aside className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-900 dark:bg-black/80 lg:border-r lg:border-b-0">
          <Container
            fluid
            className="flex flex-col py-4 lg:h-full lg:px-6 lg:py-5"
          >
            <div className="flex items-center justify-between gap-4 lg:block">
              <Link href="/dashboard" className="group no-underline">
                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  Simple CMS
                </span>
                <span className="mt-1 block text-xl font-semibold tracking-tight text-gray-950 group-hover:text-gray-700 dark:text-gray-50 dark:group-hover:text-gray-300">
                  Dashboard
                </span>
              </Link>
              <div className="lg:hidden">
                <SignoutButton />
              </div>
            </div>

            <nav className="mt-4 flex gap-2 overflow-x-auto lg:mt-6 lg:flex-col lg:overflow-visible">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 no-underline transition hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-950 dark:hover:text-gray-50 lg:rounded-xl"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto hidden rounded-3xl border border-gray-200 p-4 dark:border-gray-800 lg:block">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Signed in as
              </p>
              <p className="mt-1 font-medium text-gray-950 dark:text-gray-50">
                {user.displayName}
              </p>
              <div className="mt-4">
                <SignoutButton />
              </div>
            </div>
          </Container>
        </aside>

        <main className="min-w-0 py-4 lg:py-10">
          <Container className="max-w-7xl">{children}</Container>
        </main>
      </div>
    </div>
  );
}
