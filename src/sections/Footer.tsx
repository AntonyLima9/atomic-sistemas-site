import { Wordmark, LogoMark } from '../components/Logo'
import { contato, linkInstagram, linkWhatsApp } from '../data/contato'
import { scrollTo } from '../lib/scroll'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-ink px-5 pb-10 pt-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-5 text-white/55">Sites, painéis e aplicativos rápidos e acessíveis.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <ul className="space-y-2.5 text-white/60">
              {[
                ['Como trabalho', '#processo'],
                ['Serviços', '#servicos'],
                ['Projetos', '#projetos'],
                ['Preços', '#precos'],
              ].map(([t, h]) => (
                <li key={h}>
                  <a href={h} onClick={(e) => (e.preventDefault(), scrollTo(h))} className="hover:text-sun">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <a href={linkWhatsApp()} target="_blank" rel="noopener" className="hover:text-sun">
                  WhatsApp {contato.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={linkInstagram} target="_blank" rel="noopener" className="hover:text-sun">
                  Instagram @{contato.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Atomic Sistemas. Modelos 3D feitos em código, sem assets de terceiros.</p>
          <button onClick={() => scrollTo(0)} className="group flex items-center gap-3 font-mono uppercase tracking-widest hover:text-sun" data-cursor="topo">
            Voltar ao topo
            <LogoMark className="h-6 w-auto text-gold transition-transform duration-700 ease-expo group-hover:-translate-y-1 group-hover:rotate-[360deg]" />
          </button>
        </div>
      </div>
    </footer>
  )
}
