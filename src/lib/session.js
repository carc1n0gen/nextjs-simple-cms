import "server-only";

import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  deleteValueFromSessionToken,
  refreshSessionToken,
  sessionCookieOptions,
  signSessionPayload,
  setValueInSessionToken,
  verifySessionToken,
} from "@/lib/sessionCore";

async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

async function setSessionToken(token, expiresAt) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
}

export async function startSession(payload = {}) {
  const { token, expiresAt } = await signSessionPayload(payload);
  await setSessionToken(token, expiresAt);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession() {
  const token = await getSessionToken();
  return verifySessionToken(token);
}

export async function extendSession() {
  const currentToken = await getSessionToken();
  const { token, expiresAt } = await refreshSessionToken(currentToken);

  await setSessionToken(token, expiresAt);
}

export async function setSessionValue(key, value) {
  const currentToken = await getSessionToken();
  const { token, expiresAt } = await setValueInSessionToken(
    currentToken,
    key,
    value,
  );

  await setSessionToken(token, expiresAt);
}

export async function getSessionValue(key) {
  const payload = await getSession();
  return payload?.[key] ?? null;
}

export async function deleteSessionValue(key) {
  const currentToken = await getSessionToken();
  const { token, expiresAt } = await deleteValueFromSessionToken(
    currentToken,
    key,
  );

  await setSessionToken(token, expiresAt);
}
