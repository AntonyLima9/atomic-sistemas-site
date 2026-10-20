// Logo vetorizada a partir do arquivo original. As peças A e B formam o "λ"; C é o triângulo.
export const LOGO_PIECES = {
  a: 'M144 6 179 70 137 168 115 232 63 206 52 196Z',
  b: 'M137 168 256 235 286 307 277 314 115 232Z',
  c: 'M48 208 122 248 8 312 5 307Z',
}
export const LOGO_FULL = 'M144 6 179 70 137 168 256 235 286 307 277 314 63 206 52 196Z'

export function LogoMark({ className = '', title = 'Atomic Sistemas' }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 292 320" className={className} role="img" aria-label={title} fill="currentColor">
      <path d={LOGO_FULL} />
      <path d={LOGO_PIECES.c} />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-auto text-gold" />
      <span className="leading-none">
        <span className="block font-display text-[1.05rem] font-bold tracking-[0.18em]">ATOMIC</span>
        <span className="block font-mono text-[0.55rem] tracking-[0.42em] text-mute">SISTEMAS</span>
      </span>
    </span>
  )
}
