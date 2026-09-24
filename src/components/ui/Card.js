import { cn } from "@/components/ui/utils";

export function Card({ as: Component = "div", className, ...props }) {
  return (
    <Component
      className={cn(
        "rounded-3xl border border-gray-200 bg-white/80 dark:border-gray-800 dark:bg-black/40",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ as: Component = "div", className, ...props }) {
  return <Component className={cn("px-6 pt-6", className)} {...props} />;
}

export function CardBody({ as: Component = "div", className, ...props }) {
  return <Component className={cn("px-6 py-6", className)} {...props} />;
}

export function CardFooter({ as: Component = "div", className, ...props }) {
  return (
    <Component
      className={cn(
        "border-t border-gray-100 px-6 py-4 text-sm text-gray-500 dark:border-gray-900 dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}
