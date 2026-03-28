import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initDb } from '../lib/db.js'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const db = await initDb()
  const result = await db.execute('SELECT COUNT(*) as count FROM registrations')
  res.json({ count: Number(result.rows[0].count) })
}
