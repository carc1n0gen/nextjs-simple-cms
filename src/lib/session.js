import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = process.env.SECRET_KEY;
const ENCODED_KEY = new TextEncoder().encode(SECRET_KEY);
const SESSION_LIFETIME_DAYS = process.env.SESSION_LIFETIME_DAYS || 7;

export function makeExpireDate(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function signSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_LIFETIME_DAYS}d`)
    .sign(ENCODED_KEY);
}

export async function verifySession(session) {
  try {
    const { payload } = await jwtVerify(session, ENCODED_KEY, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (_) {
    // Session cookie is either invalid, expired, or missing. We will
    // just ignore this error and a new session will be created
    return null;
  }
}

export async function startSession() {
  const expiresAt = makeExpireDate(SESSION_LIFETIME_DAYS);
  const session = await signSession({ expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const payload = await verifySession(session);

  return payload;
}

export async function setSession(session) {
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: makeExpireDate(7),
    sameSite: "lax",
    path: "/",
  });
}

export async function extendSession() {
  const session = await getSession();

  if (!session) {
    return;
  }

  const newExpiresAt = makeExpireDate(7);
  const newSession = await signSession({
    ...session,
    expiresAt: newExpiresAt,
  });

  await setSession(newSession);
}

export async function setSessionValue(key, value) {
  const payload = await getSession();

  const newPayload = {
    ...payload,
    [key]: value,
  };
  const newSession = await signSession(newPayload);

  await setSession(newSession);
}

export async function getSessionValue(key) {
  const payload = await getSession();

  if (!payload) {
    return null;
  }

  return payload[key];
}

export async function deleteSessionValue(key) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const payload = await verifySession(session);

  const { [key]: _, ...newPayload } = payload; // remove the key from the payload with destructuring
  const newSession = await signSession(newPayload);
  await setSession(newSession);
}
