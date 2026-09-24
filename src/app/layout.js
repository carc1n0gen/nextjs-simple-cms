import "./globals.css";

export const metadata = {
  title: "NextJS Simple CMS",
  description: "A simple CMS built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-white text-gray-950 antialiased dark:bg-black dark:text-gray-50">
        {children}
      </body>
    </html>
  );
}
