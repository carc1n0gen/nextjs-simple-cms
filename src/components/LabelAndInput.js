import { cn } from "@/components/ui/utils";

export default function LabelAndInput({
  id,
  name,
  label,
  type,
  defaultValue,
  errors,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={Boolean(errors)}
        aria-describedby={errors ? `${id}-error` : undefined}
        className={cn(
          "block h-11 w-full rounded-xl border bg-white px-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:ring-4 dark:bg-black dark:text-gray-50 dark:placeholder:text-gray-600",
          errors
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
            : "border-gray-200 focus:border-gray-400 focus:ring-gray-950/5 dark:border-gray-800 dark:focus:border-gray-600 dark:focus:ring-gray-50/10",
        )}
      />
      {errors && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {errors}
        </p>
      )}
    </div>
  );
}
