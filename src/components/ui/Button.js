import { cn } from "@/components/ui/utils";

const variants = {
  primary:
    "bg-gray-950 text-white hover:bg-gray-800 focus-visible:outline-gray-950 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-gray-50",
  secondary:
    "bg-white text-gray-950 ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:outline-gray-400 dark:bg-black dark:text-gray-50 dark:ring-gray-800 dark:hover:bg-gray-950",
  ghost:
    "text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-400 dark:text-gray-300 dark:hover:bg-gray-900",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-600",
  warning:
    "bg-gray-100 text-gray-950 hover:bg-gray-200 focus-visible:outline-gray-400 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800",
  success:
    "bg-gray-950 text-white hover:bg-gray-800 focus-visible:outline-gray-950 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-gray-50",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <Component
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium no-underline transition-colors hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
