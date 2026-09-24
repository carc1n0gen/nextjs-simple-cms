"use client";

import { signout } from "@/actions/auth";
import Button from "@/components/ui/Button";

export default function SignoutButton() {
  return (
    <Button variant="secondary" size="sm" onClick={async () => await signout()}>
      Sign out
    </Button>
  );
}
