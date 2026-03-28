import { createClient } from '@libsql/client'

export function getDb() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
}

export async function initDb() {
  const db = getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS registrations (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      city         TEXT    NOT NULL,
      email        TEXT    NOT NULL,
      phone        TEXT,
      involvements TEXT    NOT NULL DEFAULT '[]',
      dealt        INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
    )
  `)
  return db
}
