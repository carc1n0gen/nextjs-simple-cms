import "server-only";

import { neboa } from "neboa";

const DATABASE_FILE = process.env.DATABASE_FILE ?? "database.db";
const globalForNeboa = globalThis;

let db;

if (process.env.NODE_ENV === "development") {
  db = globalForNeboa.neboaDatabase ??= neboa(DATABASE_FILE);
} else {
  db = neboa(DATABASE_FILE);
}

const Users = db.collection("users");
const Posts = db.collection("posts");

export { db, Users, Posts };
