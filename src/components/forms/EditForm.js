"use client";

import dynamic from "next/dynamic";
import {
  useActionState,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { savePost } from "@/actions/posts";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/utils";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

function subscribeToDarkMode(callback) {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkModeQuery.addEventListener("change", callback);

  return () => {
    darkModeQuery.removeEventListener("change", callback);
  };
}

function getDarkModeSnapshot() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerDarkModeSnapshot() {
  return false;
}

function FieldError({ id, children }) {
  if (!children) return null;

  return (
    <p id={id} className="mt-2 text-sm text-red-600 dark:text-red-400">
      {children}
    </p>
  );
}

function TextInput({ error, className, ...props }) {
  return (
    <input
      className={cn(
        "block h-11 w-full rounded-xl border bg-white px-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:ring-4 dark:bg-black dark:text-gray-50 dark:placeholder:text-gray-600",
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
          : "border-gray-200 focus:border-gray-400 focus:ring-gray-950/5 dark:border-gray-800 dark:focus:border-gray-600 dark:focus:ring-gray-50/10",
        className,
      )}
      aria-invalid={Boolean(error)}
      {...props}
    />
  );
}

function Textarea({ error, className, ...props }) {
  return (
    <textarea
      className={cn(
        "block w-full rounded-xl border bg-white px-3 py-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:ring-4 dark:bg-black dark:text-gray-50 dark:placeholder:text-gray-600",
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
          : "border-gray-200 focus:border-gray-400 focus:ring-gray-950/5 dark:border-gray-800 dark:focus:border-gray-600 dark:focus:ring-gray-50/10",
        className,
      )}
      aria-invalid={Boolean(error)}
      {...props}
    />
  );
}

function FormLabel({ htmlFor, children, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-gray-700 dark:text-gray-300",
        className,
      )}
    >
      {children}
    </label>
  );
}

export default function EditForm({ post }) {
  const editor = useRef(null);
  const [title, setTitle] = useState(post?.title || "");
  const [tags, setTags] = useState(post?.tags?.join(" ") || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const prefersDarkMode = useSyncExternalStore(
    subscribeToDarkMode,
    getDarkModeSnapshot,
    getServerDarkModeSnapshot,
  );
  const [state, action, isPending] = useActionState(savePost);

  const editorTheme = prefersDarkMode ? "dark" : "default";

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your content here...",
      height: "600px",
      theme: editorTheme,
      sourceEditorNativeOptions: {
        theme: prefersDarkMode ? "ace/theme/idle_fingers" : "ace/theme/chrome",
      },
    }),
    [editorTheme, prefersDarkMode],
  );

  const slug = useMemo(() => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }, [title]);

  const tagsArray = useMemo(() => {
    return tags.trim().split(/\s+/).filter(Boolean);
  }, [tags]);

  return (
    <form
      action={action}
      className="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black"
    >
      <input type="hidden" name="postId" value={post?._id ?? ""} readOnly />
      <input type="hidden" name="slug" value={slug} readOnly />

      <div className="grid gap-8 p-6 lg:grid-cols-[1fr_20rem] lg:p-8">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <FormLabel htmlFor="title">Title</FormLabel>
              <TextInput
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                error={state?.errors?.title}
                aria-describedby={
                  state?.errors?.title ? "title-error" : undefined
                }
              />
              <FieldError id="title-error">{state?.errors?.title}</FieldError>
            </div>

            <div className="space-y-2">
              <FormLabel htmlFor="tags">Tags</FormLabel>
              <TextInput
                type="text"
                id="tags"
                name="tags"
                value={tags}
                placeholder="nextjs cms tailwind"
                onChange={(event) => setTags(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="excerpt">Excerpt</FormLabel>
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={4}
              value={excerpt}
              error={state?.errors?.excerpt}
              aria-describedby={
                state?.errors?.excerpt ? "excerpt-error" : undefined
              }
              onChange={(event) => setExcerpt(event.target.value)}
            />
            <FieldError id="excerpt-error">{state?.errors?.excerpt}</FieldError>
          </div>

          <div className="space-y-2">
            <FormLabel className="sr-only" htmlFor="content">
              Content
            </FormLabel>
            <div className="jodit-deep-dark relative overflow-hidden rounded-2xl bg-gray-200 p-px dark:bg-gray-800">
              <div className="overflow-hidden rounded-[calc(1rem-1px)] bg-white dark:bg-black">
                <JoditEditor
                  key={editorTheme}
                  ref={editor}
                  id="content"
                  value={content}
                  config={editorConfig}
                  onChange={(newContent) => setContent(newContent)}
                />
              </div>
            </div>
            <input type="hidden" name="content" value={content} readOnly />
          </div>
        </div>

        <aside className="space-y-4 lg:border-l lg:border-gray-100 lg:pl-8 lg:dark:border-gray-900">
          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-950 dark:text-gray-50">
              Generated slug
            </p>
            <p className="mt-2 break-all text-sm text-gray-500 dark:text-gray-400">
              {slug || "Start typing a title"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-950 dark:text-gray-50">
              Tags
            </p>
            {tagsArray.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {tagsArray.map((tag, index) => (
                  <Badge key={`${tag}-${index}`}>{tag}</Badge>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Add space-separated tags.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {post ? "Update post" : "Save post"}
          </Button>
        </aside>
      </div>
    </form>
  );
}
