// Edite aqui os planos e preços.
export type Plano = {
  id: string
  nome: string
  subtitulo: string
  preco: number
  paraQuem: string
  inclui: string[]
  destaque?: boolean
}

export const planos: Plano[] = [
  {
    id: 'start',
    nome: 'Start',
    subtitulo: 'Landing Page',
    preco: 500,
    paraQuem: 'Para quem precisa estar online já.',
    inclui: [
      '1 página com design moderno',
      '100% responsivo (celular e PC)',
      'Botão de WhatsApp e links do Instagram',
      'Publicação no ar com SSL',
    ],
  },
  {
    id: 'pro',
    nome: 'Pro',
    subtitulo: 'Site Completo',
    preco: 750,
    paraQuem: 'Para empresas que querem passar autoridade.',
    destaque: true,
    inclui: [
      'Até 5 seções ou páginas',
      'Animações e efeitos modernos',
      'Galeria ou catálogo de produtos',
      'Google Maps e SEO básico',
      'Formulário que cai no seu WhatsApp',
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    subtitulo: 'Site + Painel',
    preco: 1000,
    paraQuem: 'Para quem quer atualizar tudo sozinho.',
    inclui: [
      'Tudo do plano Pro',
      'Painel para editar produtos, preços e textos',
      'Efeitos 3D e animações avançadas',
      'Treinamento para usar o painel',
    ],
  },
]

export const custosNoAr = [
  { item: 'Hospedagem (Firebase)', valor: 'R$ 0', obs: 'O plano gratuito atende a maioria dos sites.' },
  { item: 'Domínio .com.br', valor: '~R$ 40/ano', obs: 'Pago direto no Registro.br, no nome do cliente.' },
  { item: 'Painéis e apps com banco de dados', valor: 'sob uso', obs: 'Pode ter um custo mensal pequeno. Explico antes de começar.' },
]
