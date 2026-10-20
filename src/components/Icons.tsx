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
