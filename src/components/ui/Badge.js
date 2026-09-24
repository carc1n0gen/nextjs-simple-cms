import { cn } from "@/components/ui/utils";

export default function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}
