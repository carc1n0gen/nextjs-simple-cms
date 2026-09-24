"use client";

import { useState } from "react";

import { deletePost } from "@/actions/posts";
import Button from "@/components/ui/Button";

export default function DeletePostButton({ postId, postTitle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" size="sm" variant="danger" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-post-${postId}-title`}
            aria-describedby={`delete-post-${postId}-description`}
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-black"
          >
            <h2
              id={`delete-post-${postId}-title`}
              className="text-lg font-semibold text-gray-950 dark:text-gray-50"
            >
              Delete post?
            </h2>
            <p
              id={`delete-post-${postId}-description`}
              className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400"
            >
              Are you sure you want to delete “{postTitle}”? This action cannot
              be undone.
            </p>

            <form action={deletePost} className="mt-6 flex justify-end gap-3">
              <input type="hidden" name="postId" value={postId} readOnly />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="danger">
                Delete post
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
