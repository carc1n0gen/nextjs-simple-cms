import { randomBytes } from "node:crypto";

const BYTE_LENGTH = 32; // 256 bits, suitable for HS256 session signing.
const secret = randomBytes(BYTE_LENGTH).toString("base64url");

console.log(`SECRET_KEY=${secret}`);
