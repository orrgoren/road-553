import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState, useCallback } from 'react'

export const Route = createFileRoute('/')({ component: HomePage })

/* ─── Icons (inline SVG components) ─── */
function IconRoad() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M4 19L8 5" /><path d="M16 5L20 19" /><path d="M12 6V8" /><path d="M12 11V13" /><path d="M12 16V18" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconAlertTriangle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconTrendingDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  )
}
function IconSprout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
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
      { threshold: 0.15 }
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

/* ─── RevealSection wrapper ─── */
function RevealSection({ children, className = '', delay = '' }: { children: React.ReactNode; className?: string; delay?: string }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`reveal ${delay} ${className}`}>
      {children}
    </div>
  )
}

/* ─── Argument Card ─── */
function ArgumentCard({ icon, title, text, index }: { icon: React.ReactNode; title: string; text: string; index: number }) {
  const ref = useScrollReveal()
  const delayClass = `reveal-delay-${(index % 4) + 1}`
  return (
    <div ref={ref} className={`reveal ${delayClass} argument-card rounded-2xl p-6 lg:p-8`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-amber-600/15 flex items-center justify-center text-amber-500">
          {icon}
        </div>
        <h3 className="text-lg lg:text-xl font-bold text-white leading-tight" style={{ fontFamily: 'Rubik, sans-serif' }}>
          {title}
        </h3>
      </div>
      <p className="text-amber-100/60 leading-relaxed text-sm lg:text-base m-0">
        {text}
      </p>
    </div>
  )
}

/* ─── Leaflet Map Component ─── */
function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const loadLeaflet = async () => {
      // dynamically load leaflet
      const L = await import('leaflet')

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [32.26, 34.88],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
      }).addTo(map)

      L.control.zoom({ position: 'topleft' }).addTo(map)

      // Road 553 approximate path
      const roadPath: [number, number][] = [
        [32.215, 34.82],
        [32.225, 34.84],
        [32.24, 34.855],
        [32.255, 34.87],
        [32.265, 34.885],
        [32.275, 34.9],
        [32.285, 34.915],
        [32.295, 34.935],
        [32.305, 34.95],
      ]

      L.polyline(roadPath, {
        color: '#d97706',
        weight: 5,
        opacity: 0.85,
        dashArray: '10, 8',
      }).addTo(map)

      // Key markers
      const redIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#d97706;border:2px solid #fff;border-radius:50%;box-shadow:0 0 10px rgba(220,38,38,0.6)"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: '',
      })

      const markers = [
        { pos: [32.255, 34.87] as [number, number], label: 'תל מונד' },
        { pos: [32.275, 34.9] as [number, number], label: 'לב השרון' },
        { pos: [32.24, 34.855] as [number, number], label: 'כביש 553' },
      ]

      markers.forEach(m => {
        L.marker(m.pos, { icon: redIcon })
          .addTo(map)
          .bindPopup(`<div style="font-family:Heebo;direction:rtl;text-align:right;font-weight:700;color:#d97706">${m.label}</div>`)
      })

      // Affected area polygon
      L.polygon(
        [
          [32.22, 34.83],
          [32.22, 34.94],
          [32.3, 34.94],
          [32.3, 34.83],
        ],
        {
          color: '#d97706',
          fillColor: '#d97706',
          fillOpacity: 0.08,
          weight: 1,
          dashArray: '5, 5',
        }
      ).addTo(map)

      mapInstance.current = map
    }

    loadLeaflet()

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-amber-600/20">
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-amber-200 border border-amber-600/30">
        <span className="inline-block w-3 h-0.5 bg-amber-500 ml-2 align-middle"></span>
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
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-600/15 border border-green-500/30 text-green-400">
        <IconCheck />
        <span className="font-medium">תודה! נרשמת בהצלחה לניוזלטר.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600/60">
          <IconMail />
        </div>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="הכניסו את כתובת המייל שלכם"
          className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-white/5 border border-amber-600/20 text-white placeholder-amber-100/40 text-base transition-all"
          dir="rtl"
        />
      </div>
      <button
        type="submit"
        className="px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-600/25 cursor-pointer whitespace-nowrap"
      >
        הרשמה לעדכונים
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
    if (name && city) {
      setSigned(true)
      setSignCount(prev => prev + 1)
    }
  }

  const percentage = Math.min((signCount / goal) * 100, 100)

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-gray-400">יעד: {goal.toLocaleString('he-IL')} חתימות</span>
          <span className="text-2xl font-black text-white">{signCount.toLocaleString('he-IL')}</span>
        </div>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div className="petition-bar h-full rounded-full" style={{ width: `${percentage}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% מהיעד</p>
      </div>

      {signed ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-600/15 border border-green-500/30 text-green-400">
          <IconCheck />
          <span className="font-medium">תודה {name}! חתימתך נרשמה בהצלחה.</span>
        </div>
      ) : (
        <form onSubmit={handleSign} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="שם מלא"
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-amber-600/20 text-white placeholder-amber-100/40 text-base transition-all"
              dir="rtl"
            />
            <input
              type="text"
              required
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="יישוב"
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-amber-600/20 text-white placeholder-amber-100/40 text-base transition-all"
              dir="rtl"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-600/25 cursor-pointer animate-pulse-amber"
          >
            חתמו על העצומה
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
    { href: '#about', label: 'ראשי' },
    { href: '#arguments', label: 'אודות' },
    { href: '#map', label: 'תהליך הממשלה' },
    { href: '#petition', label: 'גלריה' },
    { href: '#newsletter', label: 'צור קשר' },
  ]

  return (
    <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled py-3' : 'nav-light py-3'}`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Left: CTA button (RTL = left side visually) */}
        <div className="flex items-center gap-3">
          <a
            href="#petition"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm no-underline transition-all hover:shadow-md hover:shadow-amber-500/25"
          >
            להצטרף לרשימה
          </a>
        </div>

        {/* Center: Nav links */}
        <div className="flex items-center gap-1 sm:gap-3">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs sm:text-sm text-gray-700 hover:text-amber-700 transition-colors px-2 py-1 rounded-lg hover:bg-amber-50 no-underline font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Logo (RTL = right side) */}
        <div className="flex items-center gap-2">
          <span className="font-black text-gray-800 text-base sm:text-lg hidden sm:block" style={{ fontFamily: 'Rubik, sans-serif' }}>
            מציל את תל מונד לב השרון
          </span>
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ─── MAIN PAGE ─── */
function HomePage() {
  const stats = [
    useCounter(8, 1500),
    useCounter(553, 2000),
    useCounter(6, 1500),
  ]

  const arguments_data = [
    {
      icon: <IconRoad />,
      title: 'אוטוסטרדה ארצית בלב הבית שלנו',
      text: 'כביש 553 מתוכנן להתרחב ל-6 עד 8 נתיבים שישמש כציר רוחב ארצי בין כבישים 2, 4 ו-6. המשמעות: הפיכת המרחב שלנו למסדרון תחבורה שיזרים תנועה כבדה דרך לב השרון ותל מונד.',
    },
    {
      icon: <IconShield />,
      title: 'הילדים שלנו יאבדו את החופש לנוע בבטחה',
      text: 'בתי הספר ממוקמים מחוץ ליישובים. אוטוסטרדה רחבה תחצה את המועצה ותיצור מחסום פיזי. הגעה לבית הספר, ביקור חברים או פעילות יהפכו למסוכנים ומורכבים.',
    },
    {
      icon: <IconHeart />,
      title: 'רעש, זיהום ופגיעה בבריאות',
      text: 'אלפי כלי רכב ומשאיות כבדות בכל שעה. מחקרים הוכיחו: מגורים בסמוך לאוטוסטרדות גורמים לעלייה במחלות לב וריאות ופוגעים בהתפתחות ילדים. קירות אקוסטיים לא מונעים זיהום אוויר.',
    },
    {
      icon: <IconAlertTriangle />,
      title: 'פגיעה בביטחון האישי ועלייה בפשיעה',
      text: 'חיבור ישיר לכביש 6, לערי המשולש ולעוטף טולכרם ייצור נתיבי גישה ומילוט מהירים. המשמעות: פגיעה ביכולת האכיפה, עלייה בסיכון לפשיעה, והחלשת תחושת הביטחון.',
    },
    {
      icon: <IconAlertTriangle />,
      title: 'נקודת כשל במצבי חירום',
      text: 'כשתנועה ארצית מתנקזת לציר אחד, כל תאונה או אירוע ביטחוני עלולים לשתק את האזור כולו. פגיעה ביכולת כוחות ההצלה להגיע ליישובים וביכולת התושבים להתפנות.',
    },
    {
      icon: <IconSprout />,
      title: 'פגיעה בשטחים חקלאיים ובביטחון המזון',
      text: 'לב השרון הוא אזור חקלאי פעיל. הפקעת שטחים לטובת הרחבת כביש תפגע ביכולת הייצור המקומית. בעידן שבו ביטחון מזון הוא נכס אסטרטגי, שמירה על הקרקע היא אינטרס לאומי.',
    },
    {
      icon: <IconUsers />,
      title: 'חציית המועצה לשניים ופגיעה בקהילה',
      text: 'אוטוסטרדה רחבה יוצרת חיץ פיזי בין יישובים, שכונות וקהילות. מרחב קהילתי אחד יהפוך לשטח מפוצל. הפגיעה אינה רק תחבורתית — היא פגיעה ישירה באופי החיים.',
    },
    {
      icon: <IconTrendingDown />,
      title: 'ירידה בערך הבתים ובאיכות החיים',
      text: 'קרבה לאוטוסטרדה גורמת לירידה בערך הנכסים. אזור מגורים כפרי ושקט יהפוך למרחב רועש ומזוהם. הפגיעה היא אישית, כלכלית ובלתי הפיכה עבור אלפי משפחות.',
    },
  ]

  return (
    <div className="min-h-screen">
      <StickyNav />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Landscape background gradient */}
        <div className="absolute inset-0 hero-landscape" />

        {/* Warm horizon glow */}
        <div className="absolute inset-0">
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 w-[80%] h-48 bg-amber-300/20 rounded-full blur-[80px]" />
        </div>

        {/* Bottom dark fade for text readability */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-32">
          {/* Green community badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700/70 border border-emerald-500/50 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-green"></span>
            <span className="text-emerald-200 text-sm font-medium">יוזמת תושבים — לב השרון וגוש תל מונד</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-in-up"
            style={{ fontFamily: 'Rubik, sans-serif', animationDelay: '0.4s', color: '#fde68a', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            לא בתוואי הזה
            <br />
            <span style={{ color: '#fcd34d' }}>תושבי לב השרון וגוש</span>
            <br />
            <span style={{ color: '#fde68a' }}>תל מונד מציל</span>
          </h1>

          <p className="text-lg sm:text-xl text-amber-100/90 max-w-3xl mx-auto mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.6s', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
            בכביש 553 והאזור החקלאי הסמוך, יתגנב בהחלטות הממשלה שינוי שישפיע לרעה על תושבי
            האזור ויגרום לנזק להם לבלתי חזור.
            <br />
            <strong className="text-white">התאחדו אלינו לפני שהחלטות יתקבלו על ידי הגורמים לכך.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <a
              href="#petition"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg no-underline transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/40 animate-pulse-amber"
            >
              להצטרף לאלינו
            </a>
            <a
              href="#arguments"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/40 hover:border-white/70 text-white font-bold text-lg no-underline transition-all hover:-translate-y-1 hover:bg-white/10 backdrop-blur-sm"
            >
              לדעת עוד
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
              <div className="w-1.5 h-3 rounded-full bg-white/50 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="relative py-16 border-y border-amber-600/20 bg-[#141005]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div ref={stats[0].ref}>
            <div className="stat-number text-5xl sm:text-6xl font-black">{stats[0].count}</div>
            <div className="text-amber-200/60 text-sm mt-2">נתיבים מתוכננים</div>
          </div>
          <div ref={stats[1].ref}>
            <div className="stat-number text-5xl sm:text-6xl font-black">{stats[1].count}</div>
            <div className="text-amber-200/60 text-sm mt-2">מספר הכביש</div>
          </div>
          <div ref={stats[2].ref}>
            <div className="stat-number text-5xl sm:text-6xl font-black">{stats[2].count}</div>
            <div className="text-amber-200/60 text-sm mt-2">כבישים ארציים מחוברים</div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT SECTION ═══ */}
      <section id="about" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-400 text-sm font-medium mb-4">
                מה מתוכנן?
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>
                כביש 553 לא ישתפר —<br />
                <span className="text-amber-500">הוא ישתנה לחלוטין</span>
              </h2>
            </div>
          </RevealSection>

          <RevealSection delay="reveal-delay-1">
            <div className="argument-card rounded-2xl p-8 lg:p-10 mb-8">
              <p className="text-gray-300 text-lg leading-loose m-0">
                כביש 553 מתוכנן להתרחב לכביש של <strong className="text-amber-400">6 עד 8 נתיבים</strong> שישמש כציר רוחב ארצי
                בין כבישים 2, 4 ו-6. המשמעות איננה שיפור של כביש מקומי, אלא <strong className="text-amber-400">הפיכתו למסדרון
                תחבורה ארצי</strong> שיזרים תנועה כבדה דרך לב השרון ותל מונד.
              </p>
              <p className="text-gray-300 text-lg leading-loose mt-4 mb-0">
                הרחבת הכביש אינה נועדה לשפר את איכות החיים של התושבים, אלא לשרת תנועה בין
                אזורים אחרים במדינה. <strong className="text-white">היישובים שלנו יישאו במחיר, בעוד שהתועלת
                העיקרית מיועדת לתנועה שעוברת דרכנו.</strong>
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ ARGUMENTS GRID ═══ */}
      <section id="arguments" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-400 text-sm font-medium mb-4">
                8 סיבות קריטיות
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>
                למה חייבים <span className="text-amber-500">לעצור</span> את התכנון
              </h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {arguments_data.map((arg, i) => (
              <ArgumentCard key={i} icon={arg.icon} title={arg.title} text={arg.text} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ MAP SECTION ═══ */}
      <section id="map" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-400 text-sm font-medium mb-4">
                מפת האזור
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>
                האזור שייפגע
              </h2>
              <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                הקו האדום מציג את מסלול כביש 553 המתוכנן. האזור המסומן הוא האזור שייפגע ישירות מהאוטוסטרדה.
              </p>
            </div>
          </RevealSection>
          <RevealSection delay="reveal-delay-1">
            <InteractiveMap />
          </RevealSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ PETITION ═══ */}
      <section id="petition" className="py-20 sm:py-28 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
        <div className="max-w-2xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-400 text-sm font-medium mb-4">
                פעלו עכשיו
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>
                חתמו על <span className="text-amber-500">העצומה</span>
              </h2>
              <p className="text-gray-400 mt-3">
                יש לעצור את התכנון במתכונתו הנוכחית ולבחון חלופות שלא פוגעות בקהילה.
              </p>
            </div>
          </RevealSection>
          <RevealSection delay="reveal-delay-1">
            <div className="argument-card rounded-2xl p-6 sm:p-8">
              <PetitionForm />
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="red-line" />

      {/* ═══ NEWSLETTER ═══ */}
      <section id="newsletter" className="py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-amber-600/15 flex items-center justify-center mx-auto mb-6 text-amber-500">
                <IconMail />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>
                הישארו <span className="text-amber-500">מעודכנים</span>
              </h2>
              <p className="text-gray-400 mt-3">
                הירשמו לניוזלטר שלנו וקבלו עדכונים ישירות על התקדמות המאבק, אירועים קהילתיים, ודרכי פעולה.
              </p>
            </div>
          </RevealSection>
          <RevealSection delay="reveal-delay-1">
            <div className="argument-card rounded-2xl p-6 sm:p-8">
              <NewsletterForm />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <RevealSection>
            <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center" style={{
              background: 'linear-gradient(135deg, #78350f 0%, #d97706 40%, #f59e0b 100%)'
            }}>
              <div className="absolute inset-0 opacity-15" style={{
                backgroundImage: 'radial-gradient(circle at 30% 50%, white, transparent 50%), radial-gradient(circle at 70% 50%, white, transparent 50%)'
              }} />
              <div className="relative z-10">
                <IconHome />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  לב השרון הוא בית,<br />לא מסדרון תחבורה
                </h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                  תשתיות תחבורה חייבות לשרת את התושבים, ולא לפגוע בהם.
                  יש לבחון חלופות שיאפשרו פיתוח תחבורתי מבלי לפגוע בקהילה, בביטחון, בבריאות ובמרחב הכפרי.
                </p>
                <a
                  href="#petition"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-amber-700 font-black text-lg no-underline transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  הצטרפו למאבק
                </a>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-amber-800/20 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
              </svg>
            </div>
            <span className="font-bold text-amber-200" style={{ fontFamily: 'Rubik, sans-serif' }}>מציל את לב השרון — כביש 553</span>
          </div>
          <p className="text-amber-200/50 text-sm">
            תושבי לב השרון ותל מונד למען עתיד הקהילה
          </p>
          <p className="text-amber-200/30 text-xs mt-4">
            © {new Date().getFullYear()} כל הזכויות שמורות
          </p>
        </div>
      </footer>
    </div>
  )
}
