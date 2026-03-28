import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initDb } from '../../_db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') return res.status(405).end()

  const db = await initDb()
  const result = await db.execute({
    sql: 'SELECT dealt FROM registrations WHERE id = ?',
    args: [req.query.id as string],
  })
  const row = result.rows[0]
  if (!row) return res.status(404).json({ error: 'לא נמצא' })

  const next = row.dealt === 1 ? 0 : 1
  await db.execute({
    sql: 'UPDATE registrations SET dealt = ? WHERE id = ?',
    args: [next, req.query.id as string],
  })
  res.json({ dealt: next === 1 })
}
