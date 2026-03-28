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
function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
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
      const map = L.map(mapRef.current!, { center: [32.26, 34.88], zoom: 12, zoomControl: false, attributionControl: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 16 }).addTo(map)
      L.control.zoom({ position: 'topleft' }).addTo(map)
      const roadPath: [number, number][] = [
        [32.215, 34.82],[32.225, 34.84],[32.24, 34.855],[32.255, 34.87],
        [32.265, 34.885],[32.275, 34.9],[32.285, 34.915],[32.295, 34.935],[32.305, 34.95],
      ]
      L.polyline(roadPath, { color: '#dc2626', weight: 5, opacity: 0.85, dashArray: '10, 8' }).addTo(map)
      const redIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#dc2626;border:2px solid #fff;border-radius:50%;box-shadow:0 0 10px rgba(220,38,38,0.6)"></div>',
        iconSize: [14, 14], iconAnchor: [7, 7], className: '',
      })
      const markers = [
        { pos: [32.255, 34.87] as [number, number], label: 'תל מונד' },
        { pos: [32.275, 34.9] as [number, number], label: 'לב השרון' },
        { pos: [32.24, 34.855] as [number, number], label: 'כביש 553' },
      ]
      markers.forEach(m => {
        L.marker(m.pos, { icon: redIcon }).addTo(map)
          .bindPopup(`<div style="font-family:Heebo;direction:rtl;text-align:right;font-weight:700;color:#dc2626">${m.label}</div>`)
      })
      L.polygon([[32.22, 34.83],[32.22, 34.94],[32.3, 34.94],[32.3, 34.83]], {
        color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.07, weight: 1, dashArray: '5, 5',
      }).addTo(map)
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

/* ─── Newsletter Form ─── */
function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) { setSubmitted(true); setEmail('') }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-600/15 border border-green-500/30 text-green-600">
        <IconCheck />
        <span className="font-medium">תודה! נרשמת בהצלחה לעדכונים.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400">
          <IconMail />
        </div>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="הכניסו את כתובת המייל שלכם"
          className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-stone-800 placeholder-stone-400 text-base transition-all"
          dir="rtl"
        />
      </div>
      <button type="submit" className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/25 cursor-pointer whitespace-nowrap">
        הצטרפו לרשימה
      </button>
    </form>
  )
}

/* ─── Petition Form ─── */
function PetitionForm() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [signed, setSigned] = useState(false)
  const [signCount, setSignCount] = useState(4837)
  const goal = 10000

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && city) { setSigned(true); setSignCount(prev => prev + 1) }
  }

  const percentage = Math.min((signCount / goal) * 100, 100)

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-stone-500">יעד: {goal.toLocaleString('he-IL')} חתימות</span>
          <span className="text-2xl font-black text-stone-800">{signCount.toLocaleString('he-IL')}</span>
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
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer"
          >
            אני מצטרף למאבק
          </button>
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
    <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled py-3' : 'nav-light py-3'}`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="#join"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm no-underline transition-all hover:shadow-md hover:shadow-red-600/30"
          >
            הצטרפו למאבק
          </a>
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
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
          <span className="font-black text-gray-800 text-base sm:text-lg hidden sm:block" style={{ fontFamily: 'Rubik, sans-serif' }}>
            לב השרון · כביש 553
          </span>
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M4 19L8 5" /><path d="M16 5L20 19" /><path d="M12 6V8" /><path d="M12 11V13" /><path d="M12 16V18" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ─── Warning Section Card ─── */
function WarnSection({ id, label, title, children }: { id?: string; label: string; title: string; children: React.ReactNode }) {
  const ref = useScrollReveal()
  return (
    <div id={id} ref={ref} className="reveal">
      <div className="border-r-4 border-red-600 pr-6 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2 block">{label}</span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-800 leading-tight" style={{ fontFamily: 'Rubik, sans-serif' }}>
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
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.75) 100%)'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-32">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4 animate-fade-in-up text-white"
            style={{ fontFamily: 'Rubik, sans-serif', animationDelay: '0.4s', textShadow: '0 2px 24px rgba(0,0,0,0.6)' }}
          >
            זה לא שדרוג.
          </h1>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-8 animate-fade-in-up"
            style={{ fontFamily: 'Rubik, sans-serif', animationDelay: '0.5s', textShadow: '0 2px 16px rgba(0,0,0,0.6)', color: '#d74040' }}
          >
            זה כביש ארצי שיחתוך את לב השרון וגוש תל-מונד לשניים.
          </h2>

          <p className="text-lg sm:text-xl text-white/85 max-w-3xl mx-auto mb-4 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.6s', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            כביש 553 מתוכנן להפוך מציר אזורי לכביש רוחב ארצי של 6–8 נתיבים
          </p>

          <p className="text-lg sm:text-xl text-white/85 max-w-3xl mx-auto mb-6 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.6s', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            שיזרים עשרות אלפי רכבים ביום — דרך הבית שלנו.
          </p>

          <p className="font-black text-white mx-auto mb-4 animate-fade-in-up whitespace-nowrap text-sm sm:text-base md:text-lg" style={{ animationDelay: '0.65s', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            איום על הביטחון. זיהום אוויר. ניתוק בין יישובים. פגיעה במרחב הכפרי. רעש בלתי פוסק.
          </p>

          <p className="text-lg sm:text-xl font-black text-white max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.7s', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            אם לא נעצור את זה עכשיו — נתעורר למציאות חדשה.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
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

      {/* ═══ SECURITY ═══ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <RevealSection>
            <WarnSection label="הביטחון — מה שלא מספרים לכם" title="כביש מהיר = גם נתיב מילוט">
              <p>מעבר לכל הפגיעה הסביבתית והקהילתית — יש כאן גם <strong>השלכות ביטחוניות ברורות.</strong></p>
              <BulletList items={[
                'מייצר גישה נוחה ומהירה בין אזורים',
                'מקל על תנועת גורמים עברייניים',
                'מקשה על שליטה ובקרה',
              ]} />
              <p>הקרבה שלנו לצירים רגישים הופכת את זה לנושא שאי אפשר להתעלם ממנו. זה לא פחד — <strong>זו מציאות שצריך להבין מראש.</strong></p>
            </WarnSection>
          </RevealSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ WHAT IS HAPPENING ═══ */}
      <section id="what" className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <WarnSection label="מה עומד לקרות" title="כביש במרחב כפרי הופך לאוטוסטרדה ארצית">
            <p>
              במקום כביש שמשרת את תושבי האזור — מתוכנן כאן <strong>ציר רוחב ארצי מפלצתי</strong> שיחבר בין כבישים 2, 4 ו־6.
            </p>
            <BulletList items={[
              '6 עד 8 נתיבים',
              'עשרות אלפי רכבים ביום',
              'תנועת משאיות כבדה',
              'תנועה שאינה קשורה כלל לאזור',
            ]} />
            <p className="font-bold text-stone-800 mt-4">
              זה כבר לא "הכביש שלנו" — זה כביש שמשרת את כולם, על חשבוננו.
            </p>
          </WarnSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ PERSONAL IMPACT ═══ */}
      <section id="impact" className="py-20 sm:py-28 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 space-y-20">
          <RevealSection>
            <WarnSection label="איך זה פוגע בך אישית" title="זה לא רחוק. זה נוגע אליך.">
              <p>המשמעות של התוכנית הזו לא תישאר על הנייר. <strong>היא תיכנס לחיים שלנו:</strong></p>
              <BulletList items={[
                'ילדים שיצטרכו לחצות כביש סואן כדי להגיע לחברים',
                'קושי אמיתי להגיע לבתי ספר שנמצאים מחוץ ליישוב',
                'קהילות שיתנתקו זו מזו',
                'ירידה באיכות החיים ובערך הבתים',
              ]} />
              <p>מה שהיה מרחב כפרי פתוח — <strong>יהפוך לציר תנועה רועש ומזהם.</strong></p>
            </WarnSection>
          </RevealSection>

          <div className="red-line" />

          <RevealSection>
            <WarnSection label="הפגיעה במרחב הכפרי" title="הנוף הזה לא יחזור">
              <p>המרחב שבו אנחנו חיים לא נבנה ביום אחד — <strong>והוא יכול להיהרס בהחלטה אחת.</strong></p>
              <BulletList items={[
                'פגיעה בשטחים פתוחים',
                'חיתוך רצפים אקולוגיים',
                'שינוי בלתי הפיך של הסביבה',
                'אובדן האופי הכפרי של האזור',
              ]} />
              <p className="font-bold text-stone-800">זה לא רק כביש — זה שינוי של זהות המקום.</p>
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
              <h2 className="text-3xl sm:text-4xl font-black text-stone-800" style={{ fontFamily: 'Rubik, sans-serif' }}>
                הקו האדום — בלב השרון
              </h2>
              <p className="text-stone-500 mt-3 max-w-2xl mx-auto">
                הקו האדום מציג את מסלול כביש 553 המתוכנן. האזור המסומן הוא תחום המועצה האזורית לב השרון.
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
            <WarnSection label="יש דרך אחרת" title="אנחנו לא נגד פיתוח — אנחנו בעד תכנון נכון">
              <p>ברור לכולם שצריך לשפר תשתיות — <strong>אבל לא בכל מחיר.</strong> יש פתרונות:</p>
              <BulletList items={[
                'תשתיות תחבורה מותאמות לאזור',
                'פתרונות תת קרקעיים',
                'תכנון שמשרת קודם כל את התושבים',
                'שדרוג אמיתי — בלי להפוך את האזור למסדרון ארצי',
              ]} />
              <p className="font-bold text-stone-800">אפשר לקדם — בלי להרוס.</p>
            </WarnSection>
          </RevealSection>

          <div className="red-line" />

          <RevealSection>
            <WarnSection label="למה צריך לפעול עכשיו" title="חלון הזמן נסגר">
              <p>התוכנית מתקדמת — והשלב הבא הוא <strong>שלב קריטי בתהליך האישור.</strong></p>
              <p>אחרי שזה יקרה — <strong>יהיה הרבה יותר קשה לעצור.</strong></p>
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
              <h2 className="text-3xl sm:text-4xl font-black text-stone-800" style={{ fontFamily: 'Rubik, sans-serif' }}>
                זה הבית שלנו — <span className="text-red-600">ואנחנו לא מוותרים עליו</span>
              </h2>
              <p className="text-stone-500 mt-4 leading-relaxed">
                כדי לעצור את התוכנית — צריך כוח ציבורי. מה אפשר לעשות עכשיו:
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

      <div className="red-line" />

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-20 sm:py-28 bg-red-50">
        <div className="max-w-2xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6 text-red-500">
                <IconMail />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-800" style={{ fontFamily: 'Rubik, sans-serif' }}>
                הישארו <span className="text-red-600">מעודכנים</span>
              </h2>
              <p className="text-stone-500 mt-3">
                הירשמו וקבלו עדכונים ישירות על אירועים קהילתיים, התפתחויות בתכנון, ודרכים להשתתף.
              </p>
            </div>
          </RevealSection>
          <RevealSection delay="reveal-delay-1">
            <div className="rounded-2xl p-6 sm:p-8 border border-red-200 bg-white shadow-sm">
              <NewsletterForm />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-red-200 bg-stone-900 py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-2xl sm:text-3xl font-black text-white mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
            לא בתוואי הזה.
          </p>
          <p className="text-red-400 text-xl font-bold mb-8">
            הכביש הזה חותך אותנו.
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M4 19L8 5" /><path d="M16 5L20 19" /><path d="M12 6V8" /><path d="M12 11V13" /><path d="M12 16V18" />
              </svg>
            </div>
            <span className="font-bold text-stone-300" style={{ fontFamily: 'Rubik, sans-serif' }}>לב השרון · כביש 553</span>
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
