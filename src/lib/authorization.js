import "server-only";

import { cache } from "react";

import { Users } from "@/lib/database";
import { getSessionValue } from "@/lib/session";

// Cached so we don't have to hit the database multiple times in a single request
const getUserFromSession = cache(async () => {
  const userId = await getSessionValue("userId");

  if (!userId) {
    return null;
  }

  return Users.findById(userId);
});

export async function getAuthenticatedUser() {
  const user = await getUserFromSession();

  if (!user) {
    return null;
  }

  const { password, ...sanitizedUser } = user; // destructure out the password before returning
  return sanitizedUser;
}

export async function isAuthenticated() {
  const user = await getUserFromSession();
  return !!user && !user.disabledAt; // User exists and is not disabled
}
