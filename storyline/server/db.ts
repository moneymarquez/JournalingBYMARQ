import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, entries, InsertEntry, clips, InsertClip } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Entry queries
export async function getUserEntries(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(entries).where(eq(entries.userId, userId)).orderBy((t) => t.createdAt);
}

export async function getEntryById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(entries)
    .where(and(eq(entries.id, id), eq(entries.userId, userId)))
    .limit(1);
  return result[0];
}

export async function createEntry(data: InsertEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(entries).values(data);
  // Fetch and return the created entry
  const created = await db
    .select()
    .from(entries)
    .where(and(eq(entries.userId, data.userId), eq(entries.title, data.title)))
    .orderBy((t) => t.createdAt)
    .limit(1);
  return created[0];
}

export async function updateEntry(id: number, userId: number, data: Partial<InsertEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(entries)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(entries.id, id), eq(entries.userId, userId)));
  // Fetch and return the updated entry
  const updated = await db
    .select()
    .from(entries)
    .where(and(eq(entries.id, id), eq(entries.userId, userId)))
    .limit(1);
  return updated[0];
}

export async function deleteEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(entries).where(and(eq(entries.id, id), eq(entries.userId, userId)));
}

// Clips queries
export async function getUserClips(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clips).where(eq(clips.userId, userId)).orderBy((t) => t.createdAt);
}

export async function createClip(data: InsertClip) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(clips).values(data);
  // Fetch and return the created clip
  const created = await db
    .select()
    .from(clips)
    .where(and(eq(clips.userId, data.userId), eq(clips.entryId, data.entryId)))
    .orderBy((t) => t.createdAt)
    .limit(1);
  return created[0];
}

export async function deleteClip(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(clips).where(and(eq(clips.id, id), eq(clips.userId, userId)));
}

// TODO: add feature queries here as your schema grows.
