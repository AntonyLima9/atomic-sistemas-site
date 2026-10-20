import { useEffect, useState } from 'react'
import { getMockSites } from './mockSites'

// URLs das imagens dos sites-modelo (para os prints da seção de projetos e o fallback sem WebGL).
let urls: Promise<{ desktop: string; mobile: string }> | null = null
const toUrl = (c: HTMLCanvasElement) =>
  new Promise<string>((res) => c.toBlob((b) => res(b ? URL.createObjectURL(b) : c.toDataURL()), 'image/webp', 0.86))

export function useMockImages() {
  const [img, setImg] = useState<{ desktop: string; mobile: string } | null>(null)
  useEffect(() => {
    urls ??= getMockSites().then(async ({ desktop, mobile }) => ({ desktop: await toUrl(desktop), mobile: await toUrl(mobile) }))
    let alive = true
    urls.then((u) => alive && setImg(u))
    return () => {
      alive = false
    }
  }, [])
  return img
}
