"server-only";

import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "session";

const SECRET_KEY = process.env.SECRET_KEY;
const ENCODED_KEY = new TextEncoder().encode(SECRET_KEY);
const SESSION_LIFETIME_DAYS = Number(process.env.SESSION_LIFETIME_DAYS ?? 7);
const SESSION_REFRESH_THRESHOLD_DAYS = Number(
  process.env.SESSION_REFRESH_THRESHOLD_DAYS ?? 1,
);

export function makeExpireDate(days = SESSION_LIFETIME_DAYS) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function sessionCookieOptions(expires) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  };
}

export async function signSessionPayload(payload = {}) {
  const expiresAt = makeExpireDate();

  const token = await new SignJWT({
    ...payload,
    expiresAt: expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_LIFETIME_DAYS}d`)
    .sign(ENCODED_KEY);

  return { token, expiresAt };
}

export async function verifySessionToken(token) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, ENCODED_KEY, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch {
    return null;
  }
}

export function shouldRefreshSession(payload) {
  if (!payload?.expiresAt) {
    return true;
  }

  const expiresAt = new Date(payload.expiresAt).getTime();

  if (Number.isNaN(expiresAt)) {
    return true;
  }

  const refreshThreshold = SESSION_REFRESH_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

  return expiresAt - Date.now() <= refreshThreshold;
}

export async function refreshSessionToken(token) {
  const payload = await verifySessionToken(token);
  return signSessionPayload(payload ?? {});
}

export async function getSessionTokenRefresh(token) {
  const payload = await verifySessionToken(token);

  if (payload && !shouldRefreshSession(payload)) {
    return null;
  }

  return signSessionPayload(payload ?? {});
}

export async function setValueInSessionToken(token, key, value) {
  const payload = (await verifySessionToken(token)) ?? {};

  return signSessionPayload({
    ...payload,
    [key]: value,
  });
}

export async function deleteValueFromSessionToken(token, key) {
  const payload = (await verifySessionToken(token)) ?? {};
  const { [key]: _removedValue, ...nextPayload } = payload;

  return signSessionPayload(nextPayload);
}
