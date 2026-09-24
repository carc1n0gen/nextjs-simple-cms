import { cn } from "@/components/ui/utils";

export default function Container({
  as: Component = "div",
  fluid = false,
  className,
  ...props
}) {
  return (
    <Component
      className={cn(
        fluid ? "w-full px-4 sm:px-6 lg:px-8" : "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}
