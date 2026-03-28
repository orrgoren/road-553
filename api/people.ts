import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initDb } from './_db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const db = await initDb()
  const result = await db.execute('SELECT * FROM registrations ORDER BY created_at DESC')
  res.json(result.rows.map(r => ({
    ...r,
    involvements: JSON.parse(r.involvements as string),
    dealt: r.dealt === 1,
  })))
}
