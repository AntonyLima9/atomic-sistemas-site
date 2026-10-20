// Edite aqui seus contatos. Tudo no site usa estes valores.
export const contato = {
  whatsapp: '5533998210281',
  whatsappExibicao: '(33) 99821-0281',
  instagram: 'atomic.sistemas',
  mensagemPadrao: 'Olá! Vim pelo site da Atomic e quero um orçamento.',
  // Identificação exigida para quem oferta serviços online (Decreto 7.962/2013).
  // Preencha com a razão social e o CNPJ (ou nome completo e CPF) e a cidade/UF.
  razaoSocial: 'Atomic Sistemas',
  documentoTipo: 'CNPJ' as 'CNPJ' | 'CPF',
  documento: '',
  cidade: '',
}

export const linkWhatsApp = (mensagem: string = contato.mensagemPadrao) =>
  `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`

export const linkInstagram = `https://instagram.com/${contato.instagram}`
