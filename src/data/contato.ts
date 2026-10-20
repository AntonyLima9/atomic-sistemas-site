// Edite aqui seus contatos. Tudo no site usa estes valores.
export const contato = {
  whatsapp: '5533998210281',
  whatsappExibicao: '(33) 99821-0281',
  instagram: 'atomic.sistemas',
  mensagemPadrao: 'Olá! Vim pelo site da Atomic e quero um orçamento.',
}

export const linkWhatsApp = (mensagem: string = contato.mensagemPadrao) =>
  `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`

export const linkInstagram = `https://instagram.com/${contato.instagram}`
