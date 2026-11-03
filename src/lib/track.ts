// Contagem anônima (sem cookies e sem dado pessoal): soma +1 em contadores diários no Firestore.
// Cada contador é um documento "AAAA-MM-DD_nome" → { n }. As regras do Firestore só aceitam +1
// em nomes conhecidos (lista em atomic-gestao/firestore.rules → SITE_STATS).
const PROJECT = 'atomic-sistemas'
const KEY = 'AIzaSyCYvAmWN0GdzcXJVbFhi7bUyUq4HND6Wrc' // chave pública do app web (não é segredo)
const COMMIT = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:commit?key=${KEY}`

const dia = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1'

export function track(nome: string) {
  if (local || navigator.webdriver) return
  const body = JSON.stringify({
    writes: [
      {
        transform: {
          document: `projects/${PROJECT}/databases/(default)/documents/site_stats/${dia()}_${nome}`,
          fieldTransforms: [{ fieldPath: 'n', increment: { integerValue: '1' } }],
        },
      },
    ],
  })
  // keepalive: a contagem chega mesmo quando o clique abre o WhatsApp e a página perde o foco
  fetch(COMMIT, { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {})
}

function origem() {
  const u = new URLSearchParams(location.search).get('utm_source')?.toLowerCase() ?? ''
  const r = document.referrer ? new URL(document.referrer).hostname : ''
  const s = `${u} ${r}`
  if (/instagram|ig\b/.test(s)) return 'instagram'
  if (/google/.test(s)) return 'google'
  if (/whatsapp|wa\.me/.test(s)) return 'whatsapp'
  if (/facebook|fb\b/.test(s)) return 'facebook'
  if (!s.trim() || r === location.hostname) return 'direto'
  return 'outros'
}

/** Uma visita por sessão do navegador, a origem dela e os cliques em WhatsApp/Instagram. */
export function initTracking() {
  try {
    if (!sessionStorage.getItem('atomic-visita')) {
      sessionStorage.setItem('atomic-visita', '1')
      track('visitas')
      track(`origem_${origem()}`)
    }
  } catch {
    /* navegação privada sem sessionStorage: não conta a visita */
  }
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      const rede = a.href.includes('wa.me') ? 'wa' : a.href.includes('instagram.com') ? 'insta' : ''
      if (!rede) return
      const onde = a.dataset.track ?? (a.closest('footer') ? 'rodape' : a.closest('header, [data-menu]') ? 'menu' : a.closest('section')?.id)
      if (onde) track(`${rede}_${onde}`)
    },
    { capture: true },
  )
}
