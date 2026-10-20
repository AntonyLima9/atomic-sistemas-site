// Desenha os dois sites-modelo em <canvas>. As mesmas imagens servem de textura nas telas 3D
// e de print na seção de projetos, então não há screenshots externos para manter.

type Ctx = CanvasRenderingContext2D

export const DESKTOP = { w: 1440, h: 3600, view: 900 }
export const MOBILE = { w: 390, h: 2200, view: 844, scale: 1.8 }

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
function fillRR(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) {
  rr(ctx, x, y, w, h, r)
  ctx.fillStyle = fill
  ctx.fill()
}
function text(ctx: Ctx, t: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = 'left') {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(t, x, y)
}
function stars(ctx: Ctx, x: number, y: number, size: number, color: string) {
  for (let i = 0; i < 5; i++) {
    const cx = x + i * size * 1.25
    ctx.beginPath()
    for (let k = 0; k < 10; k++) {
      const r = k % 2 ? size * 0.22 : size * 0.5
      const a = (Math.PI / 5) * k - Math.PI / 2
      ctx.lineTo(cx + Math.cos(a) * r, y + Math.sin(a) * r)
    }
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }
}

/* ---------- Ilustrações ---------- */

function cake(ctx: Ctx, cx: number, base: number, s: number, cream: string, sponge: string, top: string) {
  ctx.save()
  // prato
  ctx.fillStyle = 'rgba(59,36,32,.12)'
  ctx.beginPath()
  ctx.ellipse(cx, base + 6 * s, 150 * s, 22 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.ellipse(cx, base, 140 * s, 18 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  // camadas
  const w = 200 * s
  const layers = [sponge, cream, sponge, cream, sponge]
  const lh = 26 * s
  layers.forEach((c, i) => fillRR(ctx, cx - w / 2, base - (i + 1) * lh, w, lh + 2, 6 * s, c))
  // cobertura com escorrido
  const topY = base - layers.length * lh
  ctx.fillStyle = top
  ctx.beginPath()
  ctx.moveTo(cx - w / 2 - 4 * s, topY + 10 * s)
  for (let i = 0; i <= 10; i++) {
    const x = cx - w / 2 + (w / 10) * i
    const d = (i % 2 ? 34 : 18) * s
    ctx.quadraticCurveTo(x - 10 * s, topY + d, x, topY + 12 * s)
  }
  ctx.lineTo(cx + w / 2 + 4 * s, topY - 6 * s)
  ctx.lineTo(cx - w / 2 - 4 * s, topY - 6 * s)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx, topY - 4 * s, w / 2 + 4 * s, 14 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  // cerejas
  for (const dx of [-50, 0, 50]) {
    ctx.fillStyle = '#C8102E'
    ctx.beginPath()
    ctx.arc(cx + dx * s, topY - 20 * s, 14 * s, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,.5)'
    ctx.beginPath()
    ctx.arc(cx + dx * s - 4 * s, topY - 25 * s, 4 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function cupcake(ctx: Ctx, cx: number, base: number, s: number, frost: string) {
  ctx.fillStyle = '#C98F5B'
  ctx.beginPath()
  ctx.moveTo(cx - 55 * s, base - 70 * s)
  ctx.lineTo(cx + 55 * s, base - 70 * s)
  ctx.lineTo(cx + 40 * s, base)
  ctx.lineTo(cx - 40 * s, base)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,.12)'
  ctx.lineWidth = 3 * s
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath()
    ctx.moveTo(cx + i * 15 * s, base - 70 * s)
    ctx.lineTo(cx + i * 11 * s, base)
    ctx.stroke()
  }
  ctx.fillStyle = frost
  for (const [dx, dy, r] of [[-30, -85, 34], [30, -85, 34], [0, -100, 40], [0, -135, 28]]) {
    ctx.beginPath()
    ctx.arc(cx + dx * s, base + dy * s, r * s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = '#C8102E'
  ctx.beginPath()
  ctx.arc(cx, base - 168 * s, 12 * s, 0, Math.PI * 2)
  ctx.fill()
}

function donut(ctx: Ctx, cx: number, cy: number, s: number, glaze: string) {
  ctx.fillStyle = '#D9A066'
  ctx.beginPath()
  ctx.arc(cx, cy, 80 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = glaze
  ctx.beginPath()
  for (let i = 0; i <= 24; i++) {
    const a = (Math.PI * 2 * i) / 24
    const r = (68 + (i % 2) * 6) * s
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
  }
  ctx.fill()
  const sprinkles = ['#FFD23F', '#4FC3F7', '#fff', '#81C784']
  for (let i = 0; i < 26; i++) {
    const a = i * 2.39
    const r = (34 + ((i * 13) % 28)) * s
    ctx.save()
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    ctx.rotate(a * 3)
    ctx.fillStyle = sprinkles[i % 4]
    ctx.fillRect(-7 * s, -2 * s, 14 * s, 4 * s)
    ctx.restore()
  }
  ctx.fillStyle = '#FBF3EA'
  ctx.beginPath()
  ctx.arc(cx, cy, 24 * s, 0, Math.PI * 2)
  ctx.fill()
}

function burger(ctx: Ctx, cx: number, cy: number, s: number) {
  // pão de baixo
  fillRR(ctx, cx - 90 * s, cy + 40 * s, 180 * s, 34 * s, 16 * s, '#D98B3A')
  // carne
  fillRR(ctx, cx - 98 * s, cy + 6 * s, 196 * s, 38 * s, 18 * s, '#5A2E1B')
  // queijo
  ctx.fillStyle = '#FFC93C'
  ctx.beginPath()
  ctx.moveTo(cx - 96 * s, cy)
  ctx.lineTo(cx + 96 * s, cy)
  ctx.lineTo(cx + 70 * s, cy + 26 * s)
  ctx.lineTo(cx + 40 * s, cy + 6 * s)
  ctx.lineTo(cx - 10 * s, cy + 30 * s)
  ctx.lineTo(cx - 50 * s, cy + 6 * s)
  ctx.lineTo(cx - 80 * s, cy + 22 * s)
  ctx.closePath()
  ctx.fill()
  // alface
  ctx.fillStyle = '#6CBF4B'
  ctx.beginPath()
  ctx.moveTo(cx - 100 * s, cy - 6 * s)
  for (let i = 0; i <= 10; i++) ctx.quadraticCurveTo(cx - 100 * s + (i - 0.5) * 20 * s, cy + 14 * s, cx - 100 * s + i * 20 * s, cy - 2 * s)
  ctx.lineTo(cx + 100 * s, cy - 10 * s)
  ctx.lineTo(cx - 100 * s, cy - 10 * s)
  ctx.fill()
  // pão de cima
  const g = ctx.createLinearGradient(0, cy - 100 * s, 0, cy)
  g.addColorStop(0, '#F0A54A')
  g.addColorStop(1, '#C9741F')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(cx, cy - 8 * s, 100 * s, 82 * s, 0, Math.PI, 0)
  ctx.fill()
  ctx.fillStyle = '#FFF4DA'
  for (let i = 0; i < 12; i++) {
    const x = cx + (((i * 37) % 140) - 70) * s
    const y = cy - (30 + ((i * 23) % 44)) * s
    ctx.beginPath()
    ctx.ellipse(x, y, 5 * s, 2.6 * s, i, 0, Math.PI * 2)
    ctx.fill()
  }
}

function fries(ctx: Ctx, cx: number, cy: number, s: number) {
  ctx.fillStyle = '#FFC93C'
  for (let i = -3; i <= 3; i++) {
    ctx.save()
    ctx.translate(cx + i * 12 * s, cy - 40 * s)
    ctx.rotate(i * 0.08)
    ctx.fillRect(-5 * s, -50 * s, 10 * s, 70 * s)
    ctx.restore()
  }
  ctx.fillStyle = '#D7263D'
  ctx.beginPath()
  ctx.moveTo(cx - 50 * s, cy - 30 * s)
  ctx.lineTo(cx + 50 * s, cy - 30 * s)
  ctx.lineTo(cx + 38 * s, cy + 50 * s)
  ctx.lineTo(cx - 38 * s, cy + 50 * s)
  ctx.closePath()
  ctx.fill()
}

function drink(ctx: Ctx, cx: number, cy: number, s: number) {
  ctx.fillStyle = '#2B2B2B'
  ctx.fillRect(cx + 8 * s, cy - 85 * s, 6 * s, 50 * s)
  ctx.fillStyle = '#E94F37'
  ctx.beginPath()
  ctx.moveTo(cx - 40 * s, cy - 45 * s)
  ctx.lineTo(cx + 40 * s, cy - 45 * s)
  ctx.lineTo(cx + 30 * s, cy + 55 * s)
  ctx.lineTo(cx - 30 * s, cy + 55 * s)
  ctx.closePath()
  ctx.fill()
  fillRR(ctx, cx - 44 * s, cy - 52 * s, 88 * s, 12 * s, 6 * s, '#fff')
  fillRR(ctx, cx - 30 * s, cy - 5 * s, 60 * s, 24 * s, 4 * s, 'rgba(255,255,255,.85)')
}

/* ---------- Site desktop: Doce Ateliê ---------- */

export function drawDesktopSite(): HTMLCanvasElement {
  const { w, h } = DESKTOP
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  const cream = '#FBF3EA'
  const choc = '#3B2420'
  const rose = '#E8A1A8'
  const serif = 'Georgia, "Times New Roman", serif'
  const sans = 'Inter, system-ui, sans-serif'

  ctx.fillStyle = cream
  ctx.fillRect(0, 0, w, h)

  // nav
  text(ctx, 'Doce Ateliê', 80, 58, `italic 700 34px ${serif}`, choc)
  ;['Bolos', 'Doces', 'Festas', 'Sobre'].forEach((t, i) => text(ctx, t, 640 + i * 120, 56, `500 18px ${sans}`, '#6b5450'))
  fillRR(ctx, 1170, 26, 190, 48, 24, choc)
  text(ctx, 'Encomendar', 1265, 57, `600 18px ${sans}`, cream, 'center')

  // hero
  const hg = ctx.createRadialGradient(1050, 470, 40, 1050, 470, 520)
  hg.addColorStop(0, '#F6D5D8')
  hg.addColorStop(1, cream)
  ctx.fillStyle = hg
  ctx.fillRect(0, 100, w, 800)
  fillRR(ctx, 80, 200, 250, 40, 20, 'rgba(232,161,168,.3)')
  text(ctx, '✦ FEITO À MÃO EM MINAS', 205, 226, `600 15px ${sans}`, '#a2525c', 'center')
  text(ctx, 'Bolos que', 80, 350, `700 96px ${serif}`, choc)
  text(ctx, 'viram memória.', 80, 455, `italic 700 96px ${serif}`, '#a2525c')
  text(ctx, 'Receitas de família, ingredientes frescos e', 82, 530, `400 24px ${sans}`, '#6b5450')
  text(ctx, 'entrega no dia da sua festa.', 82, 565, `400 24px ${sans}`, '#6b5450')
  fillRR(ctx, 80, 615, 300, 66, 33, choc)
  text(ctx, 'Encomendar pelo WhatsApp', 230, 655, `600 19px ${sans}`, cream, 'center')
  rr(ctx, 400, 615, 200, 66, 33)
  ctx.strokeStyle = choc
  ctx.lineWidth = 2
  ctx.stroke()
  text(ctx, 'Ver cardápio', 500, 655, `600 19px ${sans}`, choc, 'center')
  text(ctx, '4.9', 82, 770, `700 40px ${serif}`, choc)
  stars(ctx, 160, 756, 22, '#E2B82C')
  text(ctx, '+1.200 encomendas entregues', 82, 805, `400 18px ${sans}`, '#8a7470')
  fillRR(ctx, 820, 200, 520, 600, 260, 'rgba(255,255,255,.55)')
  cake(ctx, 1080, 690, 1.55, '#FFF6EE', '#E3A86B', rose)

  // produtos
  text(ctx, 'Mais pedidos', 80, 1030, `700 56px ${serif}`, choc)
  text(ctx, 'Ver todos →', 1360, 1030, `600 20px ${sans}`, '#a2525c', 'right')
  const prods = [
    { n: 'Bolo Red Velvet', p: 'R$ 129', d: (x: number, y: number) => cake(ctx, x, y, 0.85, '#fff', '#B22234', '#fff') },
    { n: 'Cupcake de Morango', p: 'R$ 12', d: (x: number, y: number) => cupcake(ctx, x, y, 1, '#F7B6C2') },
    { n: 'Donut Confete', p: 'R$ 9', d: (x: number, y: number) => donut(ctx, x, y - 90, 1, '#F48FB1') },
    { n: 'Bolo de Ninho', p: 'R$ 119', d: (x: number, y: number) => cake(ctx, x, y, 0.85, '#fff', '#F2D7A6', '#FFF6EE') },
  ]
  prods.forEach((p, i) => {
    const x = 80 + i * 330
    fillRR(ctx, x, 1090, 300, 470, 28, '#fff')
    fillRR(ctx, x + 16, 1106, 268, 260, 20, i % 2 ? '#FDE7EA' : '#F6EBDD')
    p.d(x + 150, 1330)
    text(ctx, p.n, x + 26, 1420, `700 24px ${serif}`, choc)
    stars(ctx, x + 36, 1452, 16, '#E2B82C')
    text(ctx, p.p, x + 26, 1520, `700 30px ${sans}`, '#a2525c')
    fillRR(ctx, x + 214, 1486, 60, 50, 25, choc)
    text(ctx, '+', x + 244, 1522, `500 30px ${sans}`, '#fff', 'center')
  })

  // faixa escura
  ctx.fillStyle = choc
  ctx.fillRect(0, 1680, w, 560)
  text(ctx, 'Sua festa merece', 80, 1840, `700 64px ${serif}`, cream)
  text(ctx, 'o bolo principal.', 80, 1920, `italic 700 64px ${serif}`, rose)
  text(ctx, 'Montamos bolos temáticos para aniversários,', 82, 1990, `400 22px ${sans}`, '#d8c6c2')
  text(ctx, 'casamentos e eventos de empresa.', 82, 2024, `400 22px ${sans}`, '#d8c6c2')
  fillRR(ctx, 80, 2080, 260, 60, 30, rose)
  text(ctx, 'Fazer orçamento', 210, 2118, `600 19px ${sans}`, choc, 'center')
  ;[['12', 'anos de confeitaria'], ['48h', 'para encomendas'], ['100%', 'artesanal']].forEach(([n, l], i) => {
    const x = 820 + i * 200
    text(ctx, n, x, 1930, `700 64px ${serif}`, '#E2B82C')
    text(ctx, l, x, 1970, `400 18px ${sans}`, '#d8c6c2')
  })
  cupcake(ctx, 1260, 2200, 0.9, '#F7B6C2')

  // depoimentos
  text(ctx, 'Quem provou, voltou', 720, 2400, `700 56px ${serif}`, choc, 'center')
  const deps = [
    ['O bolo do casamento foi o assunto da festa inteira!', 'Mariana S.'],
    ['Pedi às 9h, chegou perfeito às 16h. Atendimento nota mil.', 'Carlos R.'],
    ['Melhor red velvet que já comi na vida. Sem exagero.', 'Juliana P.'],
  ]
  deps.forEach(([t, n], i) => {
    const x = 80 + i * 440
    fillRR(ctx, x, 2470, 400, 300, 28, '#fff')
    stars(ctx, x + 44, 2530, 22, '#E2B82C')
    const words = t.split(' ')
    let line = ''
    let ly = 2600
    ctx.font = `italic 400 24px ${serif}`
    for (const word of words) {
      const test = line + word + ' '
      if (ctx.measureText(test).width > 330 && line) {
        text(ctx, line, x + 34, ly, `italic 400 24px ${serif}`, choc)
        line = word + ' '
        ly += 36
      } else line = test
    }
    text(ctx, line, x + 34, ly, `italic 400 24px ${serif}`, choc)
    ctx.fillStyle = rose
    ctx.beginPath()
    ctx.arc(x + 58, 2722, 22, 0, Math.PI * 2)
    ctx.fill()
    text(ctx, n, x + 94, 2730, `600 18px ${sans}`, choc)
  })

  // CTA
  fillRR(ctx, 80, 2880, 1280, 400, 40, '#F6D5D8')
  text(ctx, 'Bateu vontade?', 720, 3020, `700 72px ${serif}`, choc, 'center')
  text(ctx, 'Faça sua encomenda em 1 minuto pelo WhatsApp.', 720, 3080, `400 24px ${sans}`, '#6b5450', 'center')
  fillRR(ctx, 570, 3130, 300, 70, 35, choc)
  text(ctx, 'Chamar no WhatsApp', 720, 3173, `600 20px ${sans}`, cream, 'center')
  // rodapé
  text(ctx, 'Doce Ateliê', 80, 3440, `italic 700 30px ${serif}`, choc)
  text(ctx, 'Rua das Flores, 120 · Seg a Sáb, 9h às 19h', 80, 3480, `400 18px ${sans}`, '#8a7470')
  text(ctx, '@doceatelie', 1360, 3440, `600 18px ${sans}`, '#a2525c', 'right')
  text(ctx, 'Site por Atomic Sistemas', 1360, 3480, `400 16px ${sans}`, '#8a7470', 'right')
  return c
}

/* ---------- Site mobile: Brasa Burger ---------- */

export function drawMobileSite(): HTMLCanvasElement {
  const { w, h, scale } = MOBILE
  const c = document.createElement('canvas')
  c.width = Math.round(w * scale)
  c.height = Math.round(h * scale)
  const ctx = c.getContext('2d')!
  ctx.scale(scale, scale)
  const bg = '#141010'
  const orange = '#FF6B1A'
  const sans = 'Inter, system-ui, sans-serif'
  const disp = '"Space Grotesk", Inter, sans-serif'

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // barra de status
  text(ctx, '9:41', 34, 34, `600 15px ${sans}`, '#fff')
  fillRR(ctx, 330, 22, 26, 13, 4, '#fff')

  // topo
  text(ctx, 'BRASA', 22, 96, `700 30px ${disp}`, orange)
  text(ctx, 'BURGER', 125, 96, `700 30px ${disp}`, '#fff')
  fillRR(ctx, 282, 70, 88, 34, 17, 'rgba(255,107,26,.15)')
  text(ctx, 'Mesa 07', 326, 92, `600 13px ${sans}`, orange, 'center')
  fillRR(ctx, 22, 122, 346, 46, 23, '#221a18')
  text(ctx, '⌕  Buscar no cardápio', 42, 151, `400 15px ${sans}`, '#8b7d78')

  // destaque
  const g = ctx.createLinearGradient(22, 190, 368, 430)
  g.addColorStop(0, '#FF8A3D')
  g.addColorStop(1, '#C2410C')
  fillRR(ctx, 22, 190, 346, 250, 26, g)
  text(ctx, 'COMBO DA CASA', 44, 230, `700 12px ${sans}`, 'rgba(255,255,255,.75)')
  text(ctx, 'Smash', 44, 270, `700 34px ${disp}`, '#fff')
  text(ctx, 'Duplo', 44, 306, `700 34px ${disp}`, '#fff')
  text(ctx, '+ batata + refri', 44, 334, `400 14px ${sans}`, 'rgba(255,255,255,.85)')
  fillRR(ctx, 44, 370, 120, 44, 22, '#fff')
  text(ctx, 'R$ 32,90', 104, 398, `700 16px ${sans}`, '#C2410C', 'center')
  burger(ctx, 280, 330, 0.75)

  // categorias
  ;['🍔 Burgers', '🍟 Porções', '🥤 Bebidas', '🍨 Doces'].forEach((t, i) => {
    const x = 22 + i * 92
    fillRR(ctx, x, 466, 84, 38, 19, i === 0 ? orange : '#221a18')
    text(ctx, t, x + 42, 490, `600 12px ${sans}`, i === 0 ? '#fff' : '#cbbdb8', 'center')
  })

  // lista
  text(ctx, 'Mais pedidos', 22, 548, `700 22px ${disp}`, '#fff')
  const items: [string, string, string, (x: number, y: number) => void][] = [
    ['Brasa Clássico', 'Blend 160g, cheddar, cebola caramelizada', 'R$ 27,90', (x, y) => burger(ctx, x, y, 0.32)],
    ['Bacon Lover', 'Blend 160g, bacon crocante, barbecue', 'R$ 31,90', (x, y) => burger(ctx, x, y, 0.32)],
    ['Batata Rústica', 'Com páprica e maionese da casa', 'R$ 18,90', (x, y) => fries(ctx, x, y + 6, 0.5)],
    ['Chicken Crispy', 'Frango empanado, alface, molho especial', 'R$ 26,90', (x, y) => burger(ctx, x, y, 0.32)],
    ['Refri Lata', 'Coca, Guaraná ou Sprite', 'R$ 6,90', (x, y) => drink(ctx, x, y + 4, 0.48)],
    ['Veggie Brasa', 'Blend de grão-de-bico, queijo, rúcula', 'R$ 28,90', (x, y) => burger(ctx, x, y, 0.32)],
    ['Onion Rings', '12 anéis de cebola empanados', 'R$ 19,90', (x, y) => fries(ctx, x, y + 6, 0.5)],
    ['Milkshake', 'Ovomaltine, morango ou Nutella', 'R$ 16,90', (x, y) => drink(ctx, x, y + 4, 0.48)],
  ]
  items.forEach(([n, d, p, draw], i) => {
    const y = 572 + i * 118
    fillRR(ctx, 22, y, 346, 104, 20, '#1d1615')
    fillRR(ctx, 34, y + 12, 80, 80, 16, '#2a201d')
    draw(74, y + 56)
    text(ctx, n, 128, y + 36, `600 16px ${sans}`, '#fff')
    ctx.font = `400 12px ${sans}`
    const short = d.length > 34 ? d.slice(0, 33) + '…' : d
    text(ctx, short, 128, y + 58, `400 12px ${sans}`, '#8b7d78')
    text(ctx, p, 128, y + 86, `700 16px ${sans}`, orange)
    fillRR(ctx, 318, y + 60, 36, 36, 18, orange)
    text(ctx, '+', 336, y + 86, `600 22px ${sans}`, '#fff', 'center')
  })

  // chamar garçom
  const by = 572 + items.length * 118 + 20
  fillRR(ctx, 22, by, 346, 150, 26, '#221a18')
  text(ctx, 'Precisa de algo?', 195, by + 50, `700 22px ${disp}`, '#fff', 'center')
  text(ctx, 'O garçom vem até sua mesa.', 195, by + 76, `400 14px ${sans}`, '#8b7d78', 'center')
  fillRR(ctx, 60, by + 94, 270, 42, 21, '#fff')
  text(ctx, '🔔  Chamar garçom', 195, by + 121, `700 15px ${sans}`, bg, 'center')

  // avaliações
  const ry = by + 180
  text(ctx, 'Avaliações', 22, ry, `700 22px ${disp}`, '#fff')
  text(ctx, '4.8', 22, ry + 52, `700 40px ${disp}`, '#fff')
  stars(ctx, 100, ry + 38, 16, '#FFC93C')
  text(ctx, '2.341 avaliações', 92, ry + 66, `400 12px ${sans}`, '#8b7d78')
  ;['"Melhor smash da cidade."', '"Pedi pela mesa, chegou em 12 min."'].forEach((t, i) => {
    fillRR(ctx, 22, ry + 92 + i * 80, 346, 66, 16, '#1d1615')
    text(ctx, t, 40, ry + 131 + i * 80, `italic 400 14px ${sans}`, '#e8dcd8')
  })

  // carrinho
  const cy = h - 110
  fillRR(ctx, 22, cy, 346, 64, 32, orange)
  fillRR(ctx, 30, cy + 8, 48, 48, 24, 'rgba(0,0,0,.2)')
  text(ctx, '3', 54, cy + 39, `700 18px ${sans}`, '#fff', 'center')
  text(ctx, 'Ver carrinho', 92, cy + 39, `700 16px ${sans}`, '#fff')
  text(ctx, 'R$ 66,70', 350, cy + 39, `700 16px ${sans}`, '#fff', 'right')
  fillRR(ctx, 140, h - 20, 110, 5, 3, 'rgba(255,255,255,.5)')
  return c
}

let cache: { desktop: HTMLCanvasElement; mobile: HTMLCanvasElement } | null = null
export async function getMockSites() {
  if (cache) return cache
  try {
    await document.fonts.ready
  } catch {
    /* segue com fontes do sistema */
  }
  cache = { desktop: drawDesktopSite(), mobile: drawMobileSite() }
  return cache
}
