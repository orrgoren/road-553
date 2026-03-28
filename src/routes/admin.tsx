import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/admin')({ component: AdminPage })

interface Person {
  id: number
  name: string
  city: string
  email: string
  phone: string | null
  involvements: string[]
  dealt: boolean
  created_at: string
}

const PW_KEY = 'admin_pw'

function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [serverError, setServerError] = useState('')
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'dealt'>('all')

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY)
    if (saved) fetchPeople(saved)
  }, [])

  const fetchPeople = async (pw: string) => {
    setLoading(true)
    setAuthError(false)
    try {
      const res = await fetch('/api/people', { headers: { 'x-admin-password': pw } })
      if (res.status === 401) { sessionStorage.removeItem(PW_KEY); setAuthError(true); return }
      if (!res.ok) throw new Error(`שגיאת שרת ${res.status}`)
      setPeople(await res.json())
      sessionStorage.setItem(PW_KEY, pw)
      setAuthed(true)
    } catch (e) {
      setAuthError(true)
      setServerError(e instanceof Error ? e.message : 'שגיאה בחיבור לשרת')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPeople(password)
  }

  const toggleDealt = async (id: number) => {
    const pw = sessionStorage.getItem(PW_KEY) ?? ''
    const res = await fetch(`/api/people/${id}/dealt`, {
      method: 'PATCH',
      headers: { 'x-admin-password': pw },
    })
    const { dealt } = await res.json()
    setPeople(prev => prev.map(p => p.id === id ? { ...p, dealt } : p))
  }

  const deletePerson = async (id: number, name: string) => {
    if (!confirm(`למחוק את ${name}?`)) return
    const pw = sessionStorage.getItem(PW_KEY) ?? ''
    await fetch(`/api/people/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': pw },
    })
    setPeople(prev => prev.filter(p => p.id !== id))
  }

  if (!authed) {
    return (
      <div dir="rtl" style={{ fontFamily: 'Heebo, sans-serif' }} className="min-h-screen bg-stone-50 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 w-full max-w-sm space-y-4">
          <h1 className="text-xl font-black text-stone-800">כניסה לניהול</h1>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="סיסמה"
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 text-base"
          />
          {authError && <p className="text-red-600 text-sm">{serverError || 'סיסמה שגויה'}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'בודק...' : 'כניסה'}
          </button>
        </form>
      </div>
    )
  }

  const shown = people.filter(p =>
    filter === 'all' ? true : filter === 'dealt' ? p.dealt : !p.dealt
  )
  const total = people.length
  const dealtCount = people.filter(p => p.dealt).length

  return (
    <div dir="rtl" style={{ fontFamily: 'Heebo, sans-serif' }} className="min-h-screen bg-stone-50 text-stone-800">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">ניהול נרשמים — כביש 553</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            סה"כ {total} נרשמים · {dealtCount} טופלו · {total - dealtCount} ממתינים
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {(['all', 'pending', 'dealt'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  filter === f ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {{ all: 'הכל', pending: 'ממתינים', dealt: 'טופלו' }[f]}
              </button>
            ))}
          </div>
          <button
            onClick={() => { sessionStorage.removeItem(PW_KEY); setAuthed(false) }}
            className="px-3 py-1.5 rounded-lg text-sm text-stone-500 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            יציאה
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {shown.length === 0 ? (
          <p className="text-center text-stone-400 py-20">אין נרשמים</p>
        ) : (
          <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  {['שם', 'יישוב', 'אימייל', 'טלפון', 'מעורבות', 'תאריך', 'סטטוס', ''].map(h => (
                    <th key={h} className="text-right px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((p, i) => (
                  <tr key={p.id} className={`border-b border-stone-100 last:border-0 ${p.dealt ? 'opacity-50' : ''} ${i % 2 === 0 ? '' : 'bg-stone-50/50'}`}>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-stone-600">{p.city}</td>
                    <td className="px-4 py-3 text-stone-600 text-left" dir="ltr">{p.email}</td>
                    <td className="px-4 py-3 text-stone-600">{p.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      {p.involvements.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {p.involvements.map(inv => (
                            <span key={inv} className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">{inv}</span>
                          ))}
                        </div>
                      ) : <span className="text-stone-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{p.created_at.slice(0, 16)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleDealt(p.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          p.dealt
                            ? 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {p.dealt ? 'בטל טיפול' : 'סמן כטופל'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deletePerson(p.id, p.name)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
