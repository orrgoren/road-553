import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({ component: HomePage })

/* ─── Icons ─── */
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ─── Scroll reveal hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

/* ─── Animated counter hook ─── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = Date.now()
          const tick = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return { count, ref }
}

/* ─── RevealSection ─── */
function RevealSection({ children, className = '', delay = '' }: { children: React.ReactNode; className?: string; delay?: string }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`reveal ${delay} ${className}`}>
      {children}
    </div>
  )
}

/* ─── Leaflet Map ─── */
function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    const loadLeaflet = async () => {
      const L = await import('leaflet')
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      const map = L.map(mapRef.current!, { center: [32.2630, 34.9504], zoom: 12, zoomControl: false, attributionControl: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 16 }).addTo(map)
      L.control.zoom({ position: 'topleft' }).addTo(map)
      // Road 553 (כביש 553) - simplified clean waypoints based on OSM data
      // North-south section from Route 2 junction, then east-west through Lev HaSharon
      const roadPath: [number, number][] = [
        [32.2599, 34.9055],
        [32.2601, 34.9080],
        [32.2608, 34.9130],
        [32.2619, 34.9220],
        [32.2615, 34.9252],
        [32.2611, 34.9268],
        [32.2609, 34.9295],
        [32.2609, 34.9335],
        [32.2608, 34.9400],
        [32.2610, 34.9430],
        [32.2615, 34.9448]
      ]
      // Proposed extension east of Road 6
      const roadPathProposed: [number, number][] = [
        [32.2615, 34.9448],
        [32.2588, 34.9494],
        [32.2524, 34.9674],
        [32.2510, 34.9831],
        [32.2505, 34.9856],
        [32.2729, 34.9950],
        [32.2745, 34.9948],
        [32.2782, 34.9942],
        [32.2834, 34.9928]
      ]
      L.polyline(roadPath, { color: '#dc2626', weight: 5, opacity: 0.85 }).addTo(map)
      L.polyline(roadPathProposed, { color: '#dc2626', weight: 4, opacity: 0.55, dashArray: '10, 8' }).addTo(map)
      L.polyline([[32.2617, 34.9509],[32.2588, 34.9494]], { color: '#dc2626', weight: 4, opacity: 0.55, dashArray: '10, 8' }).addTo(map)
      L.polyline([[32.2518, 34.9717],[32.2486, 34.9671],[32.2423, 34.9640]], { color: '#dc2626', weight: 4, opacity: 0.55, dashArray: '10, 8' }).addTo(map)
      L.polyline([
        [32.250971, 34.983329],
        [32.250813, 34.983802],
        [32.250618, 34.984219],
        [32.250384, 34.984582],
        [32.250113, 34.984899],
        [32.249805, 34.985146],
        [32.249458, 34.985347],
        [32.249073, 34.985493],
        [32.248651, 34.985584],
        [32.248192, 34.985621],
        [32.247694, 34.985604],
      ], { color: '#dc2626', weight: 4, opacity: 0.55, dashArray: '10, 8' }).addTo(map)
      L.polyline([[32.2509, 34.9833], [32.2479, 34.9938], [32.2505, 34.9944]],  { color: '#dc2626', weight: 4, opacity: 0.55, dashArray: '10, 8' }).addTo(map)
      L.polyline([[32.2479, 34.9938], [32.2457, 34.9925]],  { color: '#dc2626', weight: 4, opacity: 0.55, dashArray: '10, 8' }).addTo(map)
      const redIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#dc2626;border:2px solid #fff;border-radius:50%;box-shadow:0 0 10px rgba(220,38,38,0.6)"></div>',
        iconSize: [14, 14], iconAnchor: [7, 7], className: '',
      })
      const markers = [
        { pos: [32.2609240, 34.9137626] as [number, number], label: 'לב השרון' },
        { pos: [32.2618234, 34.9484699] as [number, number], label: 'כביש 553' },
      ]
      markers.forEach(m => {
        L.marker(m.pos, { icon: redIcon }).addTo(map)
          .bindPopup(`<div style="font-family:Heebo;direction:rtl;text-align:right;font-weight:700;color:#dc2626">${m.label}</div>`)
      })
      mapInstance.current = map
    }
    loadLeaflet()
    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null }
    }
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-red-200">
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-stone-600 border border-red-200 shadow-sm">
        <span className="inline-block w-3 h-0.5 bg-red-500 ml-2 align-middle"></span>
        מסלול כביש 553 המתוכנן
      </div>
    </div>
  )
}

/* ─── Petition Form ─── */
const INVOLVEMENTS = [
  'לשתף מידע עם שכנים ומכרים',
  'להגיש התנגדות רשמית',
  'להגיע לאירועים ומפגשים',
  'קיימת מומחיות מקצועית רלוונטית',
  'לתרום לקרן המאבק',
] as const

function PetitionForm() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [involvements, setInvolvements] = useState<Set<string>>(new Set())
  const [signed, setSigned] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [signCount, setSignCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/count', { cache: 'no-store' }).then(r => r.json()).then(({ count }) => setSignCount(count))
  }, [])
  const goal = 10000

  const toggleInvolvement = (item: string) => {
    setInvolvements(prev => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !city || !email) return
    setSubmitError(false)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, city, email, phone, involvements: Array.from(involvements) }),
    })
    if (!res.ok) { setSubmitError(true); return }
    setSigned(true)
    setSignCount(prev => (prev ?? 0) + 1)
  }

  const percentage = Math.min(((signCount ?? 0) / goal) * 100, 100)

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-stone-500">יעד: {goal.toLocaleString('he-IL')} חתימות</span>
          <span className="text-2xl font-black text-stone-800">
            {signCount === null ? '...' : signCount.toLocaleString('he-IL')}
          </span>
        </div>
        <div className="h-3 rounded-full bg-red-100 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%`, background: 'linear-gradient(90deg, #991b1b, #dc2626, #ef4444)' }} />
        </div>
        <p className="text-xs text-stone-400 mt-1">{percentage.toFixed(1)}% מהיעד</p>
      </div>

      {signed ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-600/15 border border-green-500/30 text-green-600">
          <IconCheck />
          <span className="font-medium">תודה {name}! חתימתך נרשמה בהצלחה.</span>
        </div>
      ) : (
        <form onSubmit={handleSign} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="שם מלא"
              className="flex-1 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-stone-800 placeholder-stone-400 text-base transition-all"
              dir="rtl"
            />
            <input
              type="text" required value={city} onChange={e => setCity(e.target.value)}
              placeholder="יישוב"
              className="flex-1 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-stone-800 placeholder-stone-400 text-base transition-all"
              dir="rtl"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="כתובת אימייל"
              className="flex-1 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-stone-800 placeholder-stone-400 text-base transition-all"
              dir="rtl"
            />
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="טלפון (אופציונלי)"
              className="flex-1 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-stone-800 placeholder-stone-400 text-base transition-all"
              dir="rtl"
            />
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-stone-700 mb-2">אני מעוניין/ת גם:</p>
            <div className="space-y-2">
              {INVOLVEMENTS.map(item => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group" dir="rtl">
                  <input
                    type="checkbox"
                    checked={involvements.has(item)}
                    onChange={() => toggleInvolvement(item)}
                    className="w-4 h-4 rounded border-red-300 text-red-600 accent-red-600 flex-shrink-0"
                  />
                  <span className="text-sm text-stone-600 group-hover:text-stone-800 transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer"
          >
            אני מצטרף למאבק
          </button>
          {submitError && (
            <p className="text-red-600 text-sm text-center">אירעה שגיאה, נסה שוב מאוחר יותר</p>
          )}
        </form>
      )}
    </div>
  )
}

/* ─── Sticky Nav ─── */
function StickyNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '#what', label: 'מה קורה' },
    { href: '#impact', label: 'הפגיעה' },
    { href: '#map', label: 'מפה' },
    { href: '#alternatives', label: 'חלופות' },
    { href: '#join', label: 'הצטרפו' },
  ]

  return (
    <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled' : 'nav-light py-2'}`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="#join"
            className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm no-underline transition-all hover:shadow-md hover:shadow-red-600/30"
          >
            הצטרפו למאבק
          </a>
        </div>
        <div className="hidden sm:flex items-center gap-1 sm:gap-3">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs sm:text-sm text-gray-700 hover:text-red-700 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 no-underline font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="לוגו כביש 553" className="h-16 w-auto object-contain shrink-0" />
        </div>
      </div>
    </nav>
  )
}

/* ─── Warning Section Card ─── */
function WarnSection({ id, label, title, children }: { id?: string; label: string; title: React.ReactNode; children: React.ReactNode }) {
  const ref = useScrollReveal()
  return (
    <div id={id} ref={ref} className="reveal">
      <div className="border-r-4 border-red-600 pr-6 mb-4">
        <span className="text-lg font-bold uppercase tracking-widest text-red-500 mb-2 block">{label}</span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-800 leading-tight" style={{ fontFamily: "Haim, sans-serif" }}>
          {title}
        </h2>
      </div>
      <div className="text-stone-600 leading-relaxed space-y-4 text-base sm:text-lg">
        {children}
      </div>
    </div>
  )
}

/* ─── Bullet list ─── */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-red-500"></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/* ─── MAIN PAGE ─── */
function HomePage() {
  const stats = [
    useCounter(8, 1500),
    useCounter(50000, 2000),
    useCounter(6, 1500),
  ]

  return (
    <div className="min-h-screen">
      <StickyNav />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hidden md:block" style={{
          backgroundImage: 'url(/desktop-hero.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0 block md:hidden" style={{
          backgroundImage: 'url(/mobile.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0 hidden md:block" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.75) 100%)'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-32 sm:pt-32 pb-32 hidden md:block" style={{ fontFamily: "Haim, sans-serif" }}>
          <h1
            className="text-7xl sm:text-8xl md:text-9xl font-black leading-none mb-0 animate-fade-in-up text-white"
            style={{ fontFamily: "Haim, sans-serif", animationDelay: '0.4s', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.7))' }}
          >
            דורסים
          </h1>
          <h2
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-none mb-8 animate-fade-in-up"
            style={{ fontFamily: "Haim, sans-serif", animationDelay: '0.5s', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))', color: '#d74040', marginTop: '-0.2em' }}
          >
            לנו את הבית
          </h2>

          <p className="text-base sm:text-xl max-w-3xl mx-auto mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.6s' }}>
            <span className="bg-white text-black px-2 py-0.5 leading-loose box-decoration-clone">בין בתים ופרדסים בשרון מתכננים להעביר מפלצת של אספלט ובטון, כביש 553 החדש קורע את הקהילה שלנו, מזהם את אויר הילדים שלנו</span>
          </p>

          <div className="flex flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <a
              href="#join"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-lg no-underline transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/40"
            >
              הצטרפו למאבק עכשיו
            </a>
            <a
              href="#what"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/40 hover:border-white/70 text-white font-bold text-lg no-underline transition-all hover:-translate-y-1 hover:bg-white/10 backdrop-blur-sm"
            >
              איך זה משפיע עליי?
            </a>
          </div>

          <p className="text-white/40 text-xl max-w-2xl mx-auto mt-12 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.8s' }}>
            עין ורד. עין שריד. תל מונד. פורת. יעף. יעבץ. עזריאל. בני דרור.<br />כפר הס. חרות. משמרת. קדימה.
          </p>

          <div className="text-2xl mt-4 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <span className="bg-white text-black px-1">חייבים לעצור את זה</span>{' '}<span className="font-bold text-red-500">עכשיו</span>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
              <div className="w-1.5 h-3 rounded-full bg-white/50 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="relative py-14 border-y border-red-100 bg-red-50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div ref={stats[0].ref}>
            <div className="text-5xl sm:text-6xl font-black" dir="ltr" style={{ background: 'linear-gradient(135deg,#991b1b,#dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              6–8
            </div>
            <div className="text-stone-500 text-sm mt-2">נתיבים מתוכננים</div>
          </div>
          <div ref={stats[1].ref}>
            <div className="text-5xl sm:text-6xl font-black" style={{ background: 'linear-gradient(135deg,#991b1b,#dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {stats[1].count.toLocaleString('he-IL')}+
            </div>
            <div className="text-stone-500 text-sm mt-2">כלי רכב ביום</div>
          </div>
          <div ref={stats[2].ref}>
            <div className="text-5xl sm:text-6xl font-black" style={{ background: 'linear-gradient(135deg,#991b1b,#dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              3
            </div>
            <div className="text-stone-500 text-sm mt-2">כבישים ארציים מחוברים</div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT IS HAPPENING ═══ */}
      <section id="what" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 min-w-0">
              <WarnSection label="מה עומד לקרות" title="כביש במרחב כפרי הופך לאוטוסטרדה ארצית">
                <p>
                  מתוכנן כאן <strong>ציר רוחב ארצי מפלצתי</strong> שיחבר בין כבישים 2, 4 ו־6 - במקום כביש שמשרת את תושבי האזור.
                </p>
                <BulletList items={[
                  '6 עד 8 נתיבים',
                  'עשרות אלפי רכבים ביום',
                  'תנועת משאיות כבדה',
                  'תנועה שאינה קשורה כלל לאזור',
                ]} />
                <p className="font-bold text-stone-800 mt-4">
                  זה כבר לא "הכביש שלנו", <br className="block md:hidden" /><span className="font-bold text-lg text-red-500">זה כביש שמשרת את כולם, על חשבוננו.</span>
                </p>
              </WarnSection>
            </div>
            <div className="w-full md:w-80 lg:w-96 shrink-0">
              <img src="/will_happen.jpeg" alt="כביש 553 עמוס תנועה" className="rounded-2xl object-cover object-bottom w-full aspect-4/3 shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ STRATEGIC FAILURE POINT ═══ */}
      <section className="py-20 sm:py-28 bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #dc2626 0, #dc2626 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

        <div className="max-w-5xl mx-auto px-4 relative">
          <RevealSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/40 bg-red-600/15 text-red-400 text-sm font-bold mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                מחדל ביטחוני
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-5" style={{ fontFamily: "Haim, sans-serif" }}>
                &ldquo;נקודת כשל אסטרטגית&rdquo;
                <br />
                <span className="text-red-400">והפקרת החוסן היישובי</span>
              </h2>
              <p className="text-stone-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
                <strong className="text-white">הפיכת</strong> כביש 553 ל&ldquo;צינור חיים&rdquo; יחיד ובלעדי{' '}
                <span className="text-stone-300 font-semibold"><br className="block md:hidden" />(Single Point of Failure)</span>{' '}
                <br className="block md:hidden" />עבור עשרות אלפי תושבים <br className="hidden sm:block" /><strong className="text-white">היא מחדל ביטחוני חמור</strong>.
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <RevealSection delay="reveal-delay-1">
              <div className="group rounded-2xl border border-stone-700/70 bg-stone-800/60 p-7 h-full flex flex-col transition-all duration-300 hover:border-red-700/60 hover:bg-stone-800">
                <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mb-5 shrink-0 group-hover:bg-red-600/30 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">איום 01</div>
                <h3 className="font-black text-white text-lg sm:text-xl mb-3 leading-snug" style={{ fontFamily: "Haim, sans-serif" }}>
                  העדר חלופה בחירום
                </h3>
                <p className="text-stone-400 leading-relaxed text-sm flex-1">
                  כל אירוע ביטחוני, תאונה קשה או חסימה בכביש 553שיהיה כעת עמוס הרבה מעבר ליכולת ויביא ל<strong className="text-stone-200 font-semibold">שיתוק מוחלט</strong> של יכולת הפינוי ושל הגעת כוחות הצלה, ביטחון וכיבוי אש ליישובים.
                </p>
              </div>
            </RevealSection>

            <RevealSection delay="reveal-delay-2">
              <div className="group rounded-2xl border border-stone-700/70 bg-stone-800/60 p-7 h-full flex flex-col transition-all duration-300 hover:border-amber-700/60 hover:bg-stone-800">
                <div className="w-12 h-12 rounded-xl bg-amber-600/15 border border-amber-500/25 flex items-center justify-center mb-5 shrink-0 group-hover:bg-amber-600/25 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">איום 02</div>
                <h3 className="font-black text-white text-lg sm:text-xl mb-3 leading-snug" style={{ fontFamily: "Haim, sans-serif" }}>
                  זליגת תנועה מסוכנת
                </h3>
                <p className="text-stone-400 leading-relaxed text-sm flex-1">
                  במצבי העומס הצפויים, אלפי רכבים ינותבו דרך אפליקציות ניווט לתוך <strong className="text-stone-200 font-semibold">הרחובות הצרים בתוך היישובים</strong>. &ldquo;זליגה&rdquo; זו תחסום את נתיבי המילוט ותיצור סכנה ממשית לילדים והולכי רגל.
                </p>
              </div>
            </RevealSection>

            <RevealSection delay="reveal-delay-3">
              <div className="group rounded-t-2xl border border-stone-700/70 bg-stone-800/60 h-full flex flex-col overflow-hidden transition-all duration-300 hover:border-orange-700/60 hover:bg-stone-800">
                <div className="p-7 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-xl bg-orange-600/15 border border-orange-500/25 flex items-center justify-center mb-5 shrink-0 group-hover:bg-orange-600/25 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">איום 03</div>
                  <h3 className="font-black text-white text-lg sm:text-xl mb-3 leading-snug" style={{ fontFamily: "Haim, sans-serif" }}>
                    סיכון ביטחוני - קרבה לקו התפר
                  </h3>
                  <p className="text-stone-400 leading-relaxed text-sm flex-1">
                    יצירת אוטוסטרדה חדירה המאפשרת הגעה מהירה ממוקדי חיכוך <strong className="text-stone-200 font-semibold">(יו״ש וקו התפר)</strong> אל עומק היישובים הכפריים תוך דקות ללא מעטפת הגנה ותוך פירוק החיץ החקלאי.
                  </p>
                </div>
                <img src="/security-1.jpeg" alt="כוחות ביטחון בכביש" className="w-full h-44 object-cover object-bottom shrink-0" />
                <p className="text-xs text-stone-500 text-center py-2 px-4 italic">תמונה זו נוצרה ע״י AI</p>
              </div>
            </RevealSection>
          </div>

          <RevealSection delay="reveal-delay-4">
            <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/30 px-6 py-5 flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-red-600/30 border border-red-500/40 flex items-center justify-center mt-0.5">
                <svg viewBox="0 0 24 24" fill="#ef4444" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                <strong className="text-white">המסקנה:</strong> פגיעה אנושה בחוסן הקהילתי פירוק החיץ החקלאי ויצירת מסדרון חדיר הם
                {' '}<br className="block md:hidden" /><strong className="text-red-400">מחדל ביטחוני שאי אפשר להשיב ממנו.</strong>
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ הנוף הזה לא יחזור ═══ */}
      <section className="py-20 sm:py-28 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4">
          <RevealSection>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 min-w-0">
                <WarnSection label="הפגיעה במרחב הכפרי" title="הנוף הזה לא יחזור">
                  <p>המרחב שבו אנחנו חיים לא נבנה ביום אחד<br className="block md:hidden" /><strong>{' '}והוא יכול להיהרס בהחלטה אחת.</strong></p>
                  <BulletList items={[
                    'פגיעה בשטחים פתוחים',
                    'חיתוך רצפים אקולוגיים',
                    'שינוי בלתי הפיך של הסביבה',
                    'אובדן האופי הכפרי של האזור',
                  ]} />
                  <p className="font-bold text-stone-800">זה לא רק כביש - זה שינוי של זהות המקום.</p>
                </WarnSection>
              </div>
              <div className="w-full md:w-80 lg:w-96 shrink-0">
                <img src="/view.jpeg" alt="הנוף הכפרי שייפגע" className="rounded-2xl object-cover w-full aspect-[4/3] shadow-lg" />
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ SECURITY ═══ */}
      <section className="py-20 sm:py-28 bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #dc2626 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-800/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-800/60 to-transparent" />

        <div className="max-w-5xl mx-auto px-4 relative">
          <RevealSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-800/50 bg-red-900/20 text-red-500 text-sm font-bold mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                הביטחון - מה שלא מספרים לכם
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-5" style={{ fontFamily: "Haim, sans-serif" }}>
                כביש מהיר =
                <span className="text-red-500 mr-2">נתיב מילוט</span>
              </h2>
              <p className="text-stone-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
                מעבר לכל הפגיעה הסביבתית והקהילתית<br className="block md:hidden" />יש כאן גם{' '}
                <span className="text-stone-300 font-semibold">השלכות ביטחוניות ברורות.</span>
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <RevealSection delay="reveal-delay-1">
              <div className="group rounded-2xl border border-stone-700/70 bg-stone-800/60 p-7 h-full flex flex-col transition-all duration-300 hover:border-red-900/80 hover:bg-stone-800">
                <div className="w-12 h-12 rounded-xl bg-red-900/30 border border-red-800/40 flex items-center justify-center mb-5 shrink-0 group-hover:bg-red-900/50 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">סיכון 01</div>
                <h3 className="font-black text-white text-lg sm:text-xl mb-3 leading-snug" style={{ fontFamily: "Haim, sans-serif" }}>
                  גישה נוחה ומהירה בין אזורים
                </h3>
                <p className="text-stone-400 leading-relaxed text-sm flex-1">
                  ציר מהיר המחבר אזורים שונים <strong className="text-stone-200 font-semibold">מקצר זמני נסיעה דרמטית</strong> ומאפשר תנועה בלתי מבוקרת של גורמים שאינם בני האזור לעומק הישובים הכפריים.
                </p>
              </div>
            </RevealSection>

            <RevealSection delay="reveal-delay-2">
              <div className="group rounded-t-2xl border border-stone-700/70 bg-stone-800/60 h-full flex flex-col overflow-hidden transition-all duration-300 hover:border-red-900/80 hover:bg-stone-800">
                <div className="p-7 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-xl bg-red-900/30 border border-red-800/40 flex items-center justify-center mb-5 shrink-0 group-hover:bg-red-900/50 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">סיכון 02</div>
                  <h3 className="font-black text-white text-lg sm:text-xl mb-3 leading-snug" style={{ fontFamily: "Haim, sans-serif" }}>
                    הקלה על תנועת גורמים עברייניים
                  </h3>
                  <p className="text-stone-400 leading-relaxed text-sm flex-1">
                    כביש מהיר ונגיש <strong className="text-stone-200 font-semibold">מקל על פשיעה ועל יכולת מילוט</strong> בחזרה לאזורי מוצאתופעה מוכרת ומתועדת בכל מקום שבו נפרצה הפרדה בין אזורים.
                  </p>
                </div>
                <img src="/security-2.jpeg" alt="דיון ביטחוני בטלוויזיה" className="w-full h-44 object-cover object-bottom shrink-0" />
                <p className="text-xs text-stone-500 text-center py-2 px-4 italic">תמונה זו נוצרה ע״י AI</p>
              </div>
            </RevealSection>

            <RevealSection delay="reveal-delay-3">
              <div className="group rounded-2xl border border-stone-700/70 bg-stone-800/60 p-7 h-full flex flex-col transition-all duration-300 hover:border-red-900/80 hover:bg-stone-800">
                <div className="w-12 h-12 rounded-xl bg-red-900/30 border border-red-800/40 flex items-center justify-center mb-5 shrink-0 group-hover:bg-red-900/50 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">סיכון 03</div>
                <h3 className="font-black text-white text-lg sm:text-xl mb-3 leading-snug" style={{ fontFamily: "Haim, sans-serif" }}>
                  קושי בשליטה ובקרה
                </h3>
                <p className="text-stone-400 leading-relaxed text-sm flex-1">
                  ריבוי תנועה אנונימי ובלתי מוכר <strong className="text-stone-200 font-semibold">מקשה על כוחות הביטחון לזהות חריגות</strong>. הקרבה לצירים רגישים הופכת את זה לנושא שאי אפשר להתעלם ממנו<br className="block md:hidden" />זה לא פחד, זו מציאות.
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ PERSONAL IMPACT ═══ */}
      <section id="impact" className="py-20 sm:py-28 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4">
          <RevealSection>
            <WarnSection label="איך זה פוגע בך אישית" title="זה לא רחוק. זה נוגע אליך.">
              <p>הילדים שלנו גדלים במרחב פתוח ובטוח – הולכים לחברים, נוסעים בין יישובים, בלי לחשוב פעמיים. <br className="block md:hidden" /><strong>זו איכות חיים. הכביש הזה ישנה את זה מהיסוד.</strong></p>
              <BulletList items={[
                'הדרך לבית הספר תהפוך לחצייה של ציר מהיר ומסוכן',
                'ילדים יהיו תלויים בהסעות ובתיאומים במקום בעצמאות',
                'פעולות יומיומיות – קניות, רפואה, חוג – ידרשו תכנון ועקיפות',
                'מרחב פתוח ונגיש יהפוך למרחב מקוטע',
              ]} />
              <p className="border-r-2 border-red-400 pr-4"><strong>זו פגיעה בעצמאות, בתחושת הביטחון,<br className="block md:hidden" />ובדרך החיים שבחרנו לחיות.</strong></p>
            </WarnSection>
          </RevealSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ MAP ═══ */}
      <section id="map" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-700 text-sm font-medium mb-4">
                מפת האזור
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-800" style={{ fontFamily: "Haim, sans-serif" }}>
                הקו האדום בלב השרון
              </h2>
              <p className="text-stone-500 mt-3 max-w-2xl mx-auto">
                הקו האדום המקווקו מציג את מסלול כביש 553 המתוכנן.
              </p>
            </div>
          </RevealSection>
          <RevealSection delay="reveal-delay-1">
            <InteractiveMap />
          </RevealSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ ALTERNATIVES ═══ */}
      <section id="alternatives" className="py-20 sm:py-28 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 space-y-20">
          <RevealSection>
            <WarnSection label="יש דרך אחרת" title={<>אנחנו לא נגד פיתוח<br className="block md:hidden" />{' '}אנחנו בעד תכנון נכון</>}>
              <p>ברור לכולם שצריך לשפר תשתיות<strong> אבל לא בכל מחיר.</strong> יש פתרונות:</p>
              <BulletList items={[
                'תשתיות תחבורה מותאמות לאזור',
                'פתרונות תת קרקעיים',
                'תכנון שמשרת קודם כל את התושבים',
                'שדרוג אמיתיבלי להפוך את האזור למסדרון ארצי',
              ]} />
              <p className="font-bold text-stone-800">אפשר לקדם, בלי להרוס.</p>
            </WarnSection>
          </RevealSection>

          <div className="red-line" />

          <RevealSection>
            <WarnSection label="למה צריך לפעול עכשיו" title="חלון הזמן נסגר">
              <p>התוכנית מתקדמת והשלב הבא הוא <strong>שלב קריטי בתהליך האישור.</strong></p>
              <p>אחרי שזה יקרה - <strong>יהיה הרבה יותר קשה לעצור.</strong></p>
              <p className="font-bold text-red-700 text-xl">הזמן לפעול הוא עכשיו.</p>
            </WarnSection>
          </RevealSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ JOIN ═══ */}
      <section id="join" className="py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-700 text-sm font-medium mb-4">
                הצטרפו למאבק
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-800" style={{ fontFamily: "Haim, sans-serif" }}>
                <span className="text-green-700">זה הבית שלנו</span><br className="block md:hidden" /> <span className="text-red-600">ואנחנו לא מוותרים עליו</span>
              </h2>
              <p className="text-stone-500 mt-4 leading-relaxed">
                כדי לעצור את התוכנית צריך כוח ציבורי.<br className="block md:hidden" />{' '}מה אפשר לעשות עכשיו:
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm text-stone-600">
                {['להצטרף לקבוצת עדכונים', 'לשתף את המידע', 'לקחת חלק בפעילות', 'להגיש התנגדות'].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </RevealSection>
          <RevealSection delay="reveal-delay-1">
            <div className="rounded-2xl p-6 sm:p-8 border border-red-200 bg-white shadow-sm">
              <PetitionForm />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-red-200 bg-stone-900 py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-2xl sm:text-3xl font-black text-white mb-2" style={{ fontFamily: "Haim, sans-serif" }}>
            לא בתוואי הזה.
          </p>
          <p className="text-red-400 text-xl font-bold mb-8">
            הכביש הזה חותך אותנו.
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="לוגו כביש 553" className="h-16 w-auto object-contain" />
            <span className="font-bold text-stone-300" style={{ fontFamily: "Haim, sans-serif" }}>לב השרון · תל מונד · כביש 553</span>
          </div>
          <p className="text-stone-500 text-sm">
            תושבי לב השרון ותל מונד למען עתיד הקהילה
          </p>
          <p className="text-stone-600 text-xs mt-4">
            © {new Date().getFullYear()} כל הזכויות שמורות
          </p>
        </div>
      </footer>
    </div>
  )
}
