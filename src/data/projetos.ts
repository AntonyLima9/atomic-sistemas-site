// Adicione seus projetos reais aqui. `imagem` pode ser um caminho em /public (ex.: '/projetos/meu-site.webp').
// Os itens com `modelo: 'desktop' | 'mobile'` usam os sites de demonstração gerados pelo próprio site.
export type Projeto = {
  nome: string
  tipo: string
  descricao: string
  tags: string[]
  link?: string
  imagem?: string
  modelo?: 'desktop' | 'mobile'
  demonstracao?: boolean
}

export const projetos: Projeto[] = [
  {
    nome: 'Doce Ateliê',
    tipo: 'Site + painel',
    descricao: 'Confeitaria artesanal com vitrine de produtos e encomenda direto no WhatsApp.',
    tags: ['Site', 'Catálogo', 'WhatsApp'],
    modelo: 'desktop',
    demonstracao: true,
  },
  {
    nome: 'Brasa Burger',
    tipo: 'Cardápio digital',
    descricao: 'App de cardápio com carrinho e botão "Chamar garçom" na mesa.',
    tags: ['App web', 'Cardápio', 'PWA'],
    modelo: 'mobile',
    demonstracao: true,
  },
]
