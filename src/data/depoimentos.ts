// Depoimentos de clientes reais. Enquanto a lista estiver vazia, a seção não aparece no site.
// Peça autorização ao cliente antes de publicar nome, foto e texto (LGPD).
// `foto` é opcional: coloque o arquivo em /public/depoimentos/ (ex.: '/depoimentos/maria.webp').
export type Depoimento = {
  nome: string
  empresa: string
  texto: string
  foto?: string
}

export const depoimentos: Depoimento[] = [
  // {
  //   nome: 'Maria Souza',
  //   empresa: 'Doce Ateliê',
  //   texto: 'O site ficou pronto em uma semana e já recebemos encomendas pelo WhatsApp no primeiro dia.',
  //   foto: '/depoimentos/maria.webp',
  // },
]
