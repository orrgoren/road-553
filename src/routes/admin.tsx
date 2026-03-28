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

function AdminPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'dealt'>('all')

  useEffect(() => {
    fetch('/api/people')
      .then(r => r.json())
      .then(data => { setPeople(data); setLoading(false) })
  }, [])

  const toggleDealt = async (id: number) => {
    const res = await fetch(`/api/people/${id}/dealt`, { method: 'PATCH' })
    const { dealt } = await res.json()
    setPeople(prev => prev.map(p => p.id === id ? { ...p, dealt } : p))
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
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-stone-400 py-20">טוען...</p>
        ) : shown.length === 0 ? (
          <p className="text-center text-stone-400 py-20">אין נרשמים</p>
        ) : (
          <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  {['שם', 'יישוב', 'אימייל', 'טלפון', 'מעורבות', 'תאריך', 'סטטוס'].map(h => (
                    <th key={h} className="text-right px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((p, i) => (
                  <tr key={p.id} className={`border-b border-stone-100 last:border-0 ${p.dealt ? 'opacity-50' : ''} ${i % 2 === 0 ? '' : 'bg-stone-50/50'}`}>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-stone-600">{p.city}</td>
                    <td className="px-4 py-3 text-stone-600 dir-ltr text-left">{p.email}</td>
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
                    <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{p.created_at.slice(0, 16).replace('T', ' ')}</td>
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
