import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initDb } from './_db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, city, email, phone, involvements } = req.body
  if (!name || !city || !email) return res.status(400).json({ error: 'שדות חובה חסרים' })

  const db = await initDb()
  const result = await db.execute({
    sql: 'INSERT INTO registrations (name, city, email, phone, involvements) VALUES (?, ?, ?, ?, ?)',
    args: [name, city, email, phone ?? null, JSON.stringify(involvements ?? [])],
  })
  res.json({ id: Number(result.lastInsertRowid) })
}
