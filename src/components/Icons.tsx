type P = { className?: string }
export const IconChat = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5Z" />
    <path d="M9 9.5c.3 1.8 1.8 3.8 3.9 4.6l1-1 1.8.8c-.3 1-1.2 1.6-2.3 1.4C10.6 14.8 8.5 12.5 8 10c-.2-1 .4-2 1.4-2.3l.8 1.8-1.2 0Z" />
  </svg>
)
export const IconInsta = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
export const IconArrow = ({ className = 'h-4 w-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const IconDown = ({ className = 'h-4 w-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
)
export const IconCheck = ({ className = 'h-4 w-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const IconSite = ({ className = 'h-7 w-7' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="2.5" y="4" width="19" height="14" rx="2" />
    <path d="M2.5 8h19M6 6h.01M8.5 6h.01M8 21h8" strokeLinecap="round" />
  </svg>
)
export const IconPanel = ({ className = 'h-7 w-7' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9M13 17v-3M16 17v-5M19 17v-2" />
  </svg>
)
export const IconApp = ({ className = 'h-7 w-7' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <rect x="6" y="2" width="12" height="20" rx="3" />
    <path d="M10.5 18.5h3M9 7h6M9 10.5h6M9 14h3" />
  </svg>
)

/* ---------- Conjunto em linha (stroke 1.6), usado nos cards e listas ---------- */
const Line = ({ className = 'h-5 w-5', children }: P & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
)
export const IconBolt = (p: P) => (
  <Line {...p}>
    <path d="M13.2 2.5 4.8 13.1a.6.6 0 0 0 .5 1H11l-1 7.4 8.4-10.6a.6.6 0 0 0-.5-1H12.3l.9-7.4Z" />
  </Line>
)
export const IconDevices = (p: P) => (
  <Line {...p}>
    <rect x="2.5" y="4" width="14" height="10" rx="1.6" />
    <path d="M1.5 17h11" />
    <rect x="15.5" y="9" width="7" height="12" rx="1.6" />
    <path d="M18.5 18.5h1" />
  </Line>
)
export const IconBag = (p: P) => (
  <Line {...p}>
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    <path d="m9.5 15 1.8 1.8 3.5-3.6" />
  </Line>
)
export const IconMessage = (p: P) => (
  <Line {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4h0A2.5 2.5 0 0 1 4 13.5v-8Z" />
    <path d="M8.5 8.5h7M8.5 11.5h4" />
  </Line>
)
export const IconLayout = (p: P) => (
  <Line {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M3 9h18M10 9v12" />
    <path d="M13.5 13h4M13.5 16.5h2.5" />
  </Line>
)
export const IconCode = (p: P) => (
  <Line {...p}>
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15" />
  </Line>
)
export const IconRocket = (p: P) => (
  <Line {...p}>
    <path d="M12.5 15.5 8.5 11.5C10 6.5 14 3 20.5 3.5 21 10 17.5 14 12.5 15.5Z" />
    <circle cx="15.5" cy="8.5" r="1.6" />
    <path d="M8.5 11.5 5 11l3-3.5h4M12.5 15.5l.5 3.5 3.5-3v-4" />
    <path d="M6 17c-1.5.5-2.5 2-2.5 3.5C5 20.5 6.5 19.5 7 18" />
  </Line>
)
export const IconCard = (p: P) => (
  <Line {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10h19M6.5 15h3" />
  </Line>
)
export const IconClock = (p: P) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Line>
)
export const IconStar = ({ className = 'h-3.5 w-3.5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8Z" />
  </svg>
)

// Ícone em "azulejo" de vidro com borda em gradiente dourado e brilho suave.
export function IconTile({ icon: Icon, size = 'md' }: { icon: (p: P) => React.ReactElement; size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'sm' ? 'h-9 w-9 rounded-[10px]' : size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl'
  const ic = size === 'sm' ? 'h-[18px] w-[18px]' : size === 'lg' ? 'h-7 w-7' : 'h-[22px] w-[22px]'
  return (
    <span className={`icon-tile relative grid shrink-0 place-items-center text-sun ${box}`}>
      <Icon className={`relative ${ic}`} />
    </span>
  )
}
