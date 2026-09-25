import "server-only";

import { cache } from "react";

import { Users } from "@/lib/database";
import { getSessionValue } from "@/lib/session";

export const getAuthenticatedUser = cache(async () => {
  const userId = await getSessionValue("userId");
  if (!userId) {
    return null;
  }

  const user = Users.query().equalTo("_id", userId).first();
  if (!user) {
    return null;
  }

  const { password, ...sanitizedUser } = user; // destructure out the password before returning
  return sanitizedUser;
});

export async function isAuthenticated() {
  const user = await getAuthenticatedUser();
  return !!user && !user.disabledAt; // User exists and is not disabled
}
