import Link from "next/link";

import Container from "@/components/ui/Container";

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header className="border-b border-gray-100 dark:border-gray-900">
        <Container className="py-8 sm:py-12">
          <nav className="mb-12 flex items-center justify-between text-sm">
            <Link
              href="/"
              className="font-medium text-gray-950 no-underline hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
            >
              NextJS Simple CMS
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-gray-200 px-4 py-2 text-gray-700 no-underline transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-950"
            >
              Dashboard
            </Link>
          </nav>
          <div className="max-w-2xl">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-950 dark:text-gray-50 sm:text-6xl">
              My Silly Little Blog
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Beware of the silliness that lies within!
            </p>
          </div>
        </Container>
      </header>
      <Container as="main" className="py-12">
        {children}
      </Container>
    </div>
  );
}
