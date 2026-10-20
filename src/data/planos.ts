// Edite aqui os planos e preços.
// Escopo e prazos baseados nas tabelas de mercado de 2026 (freelancer, faixa de entrada):
// landing simples 8–20h e 1–2 semanas; institucional 5 páginas ~3 semanas; site com painel 3–6 semanas;
// 2 rodadas de ajuste é o padrão mais citado; treinamento do painel em menos de 1 hora.
export type Plano = {
  id: string
  nome: string
  subtitulo: string
  preco: number
  prazo: string
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
    prazo: 'Entrega em até 7 dias',
    paraQuem: 'Uma página única para apresentar seu negócio e captar contatos.',
    inclui: [
      '1 página com até 5 seções (início, benefícios, depoimentos, contato e rodapé)',
      'Layout responsivo para celular e computador',
      'Formulário e botão que levam ao seu WhatsApp',
      'SEO on-page básico (título, descrição e estrutura)',
      '2 rodadas de ajustes',
      'Publicação com SSL (cadeado de segurança)',
    ],
  },
  {
    id: 'pro',
    nome: 'Pro',
    subtitulo: 'Site Institucional',
    preco: 750,
    prazo: 'Entrega em 2 a 3 semanas',
    paraQuem: 'Para empresas que precisam de um site completo com várias páginas.',
    destaque: true,
    inclui: [
      'Até 5 páginas (ex.: início, sobre, serviços, galeria e contato)',
      'Layout responsivo para celular e computador',
      'Formulário de contato integrado ao WhatsApp',
      'SEO on-page básico em todas as páginas',
      'Google Analytics com aviso de cookies',
      'Política de privacidade (LGPD)',
      '2 rodadas de ajustes',
      'Publicação com SSL e ajuda para conectar seu domínio',
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    subtitulo: 'Site + Painel',
    preco: 1000,
    prazo: 'Entrega em 3 a 4 semanas',
    paraQuem: 'Para quem quer atualizar textos, fotos e produtos sozinho.',
    inclui: [
      'Tudo do plano Pro',
      'Painel para editar textos, fotos, produtos e preços',
      'Login seguro para você acessar o painel',
      'Treinamento por videochamada (até 1 hora)',
      'Guia rápido de uso do painel',
    ],
  },
]

export const custosNoAr = [
  { item: 'Hospedagem (Firebase)', valor: 'R$ 0', obs: 'No plano gratuito do Google, dentro dos limites de uso. Atende a maioria dos sites institucionais.' },
  { item: 'Domínio .com.br', valor: '~R$ 40/ano', obs: 'Pago direto no Registro.br, no nome do cliente.' },
  { item: 'Painéis e apps com banco de dados', valor: 'sob uso', obs: 'Pode ter um custo mensal pequeno. Explicamos antes de começar.' },
]
