import "server-only";

import { randomUUID } from "node:crypto";

import { JSONFileSyncPreset } from "lowdb/node";

const DATABASE_FILE = process.env.DATABASE_FILE ?? "database.json";

const defaultData = { users: [], posts: [] };

const globalForDatabase = globalThis;

const db = (globalForDatabase.lowDb ??= JSONFileSyncPreset(
  DATABASE_FILE,
  defaultData,
));

function compare(a, b) {
  if (a === b) return 0;
  if (a === undefined || a === null) return -1;
  if (b === undefined || b === null) return 1;
  return a < b ? -1 : 1;
}

export class Collection {
  #name;

  constructor(name) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  get #documents() {
    return (db.data[this.#name] ??= []);
  }

  #indexOfId(id) {
    return this.#documents.findIndex((doc) => doc._id === id);
  }

  all() {
    return this.#documents;
  }

  sortedBy(key, direction = "desc") {
    const sign = direction === "asc" ? 1 : -1;
    return [...this.#documents].sort((a, b) => sign * compare(a[key], b[key]));
  }

  filter(predicate) {
    return this.#documents.filter(predicate);
  }

  find(predicate) {
    return this.#documents.find(predicate) ?? null;
  }

  findById(id) {
    if (!id) return null;
    return this.#documents.find((doc) => doc._id === id) ?? null;
  }

  insert(fields) {
    const now = new Date().toISOString();
    const document = {
      _id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...fields,
    };

    this.#documents.push(document);
    db.write();
    return document;
  }

  update(id, changes) {
    const index = this.#indexOfId(id);
    if (index === -1) return null;

    const document = {
      ...this.#documents[index],
      ...changes,
      _id: id, // the id is not rewritable
      updatedAt: new Date().toISOString(),
    };

    this.#documents[index] = document;
    db.write();
    return document;
  }

  remove(id) {
    const index = this.#indexOfId(id);
    if (index === -1) return false;

    this.#documents.splice(index, 1);
    db.write();
    return true;
  }
}

export const Users = new Collection("users");

export const Posts = new Collection("posts");
