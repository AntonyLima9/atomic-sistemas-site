import { createElement, type ElementType } from 'react'

// Quebra o texto em palavras/letras para a entrada letra a letra (blur → nítido).
// Trechos entre *asteriscos* recebem a classe `accent`.
export function SplitText({
  text,
  as = 'span',
  className = '',
  accent = 'text-shine',
  delay = 0,
}: {
  text: string
  as?: ElementType
  className?: string
  accent?: string
  delay?: number
}) {
  let i = delay
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean)
  const children = parts.map((part, pi) => {
    const isAccent = part.startsWith('*')
    const clean = isAccent ? part.slice(1, -1) : part
    const words = clean.split(/(\s+)/)
    return (
      <span key={pi} className={isAccent ? accent : undefined}>
        {words.map((w, wi) =>
          /^\s+$/.test(w) ? (
            ' '
          ) : (
            <span className="w" key={wi}>
              {[...w].map((ch, ci) => (
                <span className={`c ${isAccent ? accent : ''}`} key={ci} style={{ ['--i' as string]: i++ }}>
                  {ch}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    )
  })
  return createElement(as, { className: `split ${className}`, 'aria-label': text.replace(/\*/g, '') }, <span aria-hidden>{children}</span>)
}
