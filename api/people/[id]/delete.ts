import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initDb } from '../../../lib/db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const db = await initDb()
  const result = await db.execute({
    sql: 'DELETE FROM registrations WHERE id = ?',
    args: [req.query.id as string],
  })
  if (result.rowsAffected === 0) return res.status(404).json({ error: 'לא נמצא' })
  res.json({ ok: true })
}
