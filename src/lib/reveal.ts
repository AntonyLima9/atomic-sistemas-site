// Um único IntersectionObserver para todas as entradas (.split e [data-reveal]).
export function initReveals() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  )
  document.querySelectorAll('.split, [data-reveal]').forEach((el) => io.observe(el))
  return () => io.disconnect()
}
