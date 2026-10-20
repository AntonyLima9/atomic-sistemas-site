# Atomic Sistemas · site oficial

Site 3D da Atomic Sistemas: MacBook e iPhone girando com o scroll, cursor "átomo", vidro fosco,
preços e contato direto no WhatsApp. Feito com Vite + React + TypeScript + Three.js (React Three Fiber),
GSAP/ScrollTrigger, Lenis e Tailwind. Hospedado no Firebase Hosting.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

## Onde eu troco cada coisa

| O quê | Arquivo |
|---|---|
| WhatsApp, Instagram, mensagem padrão | `src/data/contato.ts` |
| Planos, preços e custos para colocar no ar | `src/data/planos.ts` |
| Projetos do portfólio | `src/data/projetos.ts` (coloque imagens em `public/projetos/`) |
| Perguntas frequentes | `src/data/faq.ts` |
| Textos das seções | `src/sections/*.tsx` |
| Cores | `src/styles/index.css` (`:root`) e `tailwind.config.js` |
| Logo | `public/brand/logo.svg`, `public/favicon.svg` e os pontos em `src/three/logoShapes.ts` |
| Sites que aparecem nas telas do MacBook/iPhone | `src/lib/mockSites.ts` (desenhados em canvas) |
| Imagem de compartilhamento e ícone | `npm run og` (gera `public/og.png` e `public/icon-512.png`) |

### Adicionar um projeto real

Em `src/data/projetos.ts`:

```ts
{
  nome: 'Nome do cliente',
  tipo: 'Site institucional',
  descricao: 'Uma frase sobre o projeto.',
  tags: ['Site', 'WhatsApp'],
  link: 'https://site-do-cliente.com.br',
  imagem: '/projetos/cliente.webp', // print de página inteira, 1440px de largura
},
```

## Publicar

### Primeira vez

```bash
npx firebase login
npx firebase projects:create atomic-sistemas   # se o ID estiver ocupado, escolha outro
npx firebase use atomic-sistemas
npm run deploy
```

O site fica em `https://atomic-sistemas.web.app` (ou `https://<seu-id>.web.app`).
Se usar outro ID, troque em `.firebaserc` e nas URLs do `index.html`, `robots.txt` e `sitemap.xml`.

### Deploy automático pelo GitHub

```bash
npx firebase init hosting:github
```

O comando cria o secret da conta de serviço no GitHub. Os workflows em `.github/workflows` esperam
o secret com o nome `FIREBASE_SERVICE_ACCOUNT`; se o Firebase criar com outro nome
(ex.: `FIREBASE_SERVICE_ACCOUNT_ATOMIC_SISTEMAS`), ajuste o nome nos dois arquivos `.yml`.

- Push na `main` → publica no site oficial.
- Pull Request → gera um link de preview temporário, comentado no PR.

### Domínio próprio (.com.br)

1. Registre o domínio no [Registro.br](https://registro.br) (~R$ 40/ano).
2. Firebase Console → Hosting → **Adicionar domínio personalizado**.
3. Copie os registros (A e TXT) que o Firebase mostrar para o DNS do Registro.br.
4. Em algumas horas o SSL é emitido automaticamente.

## Desempenho e acessibilidade

- A cena 3D é carregada depois do primeiro paint, em um chunk separado.
- Em celulares e GPUs fracas o pós-processamento é desligado automaticamente.
- Com "reduzir movimento" ativado ou sem WebGL, o site mostra uma versão estática.
- Os modelos 3D são feitos em código: não há arquivos de terceiros nem licenças para creditar.
