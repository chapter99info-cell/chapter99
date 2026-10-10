const SITE = 'https://www.chapter99info.com'

export function setSeo(opts: {
  title: string
  description: string
  path: string
  image?: string
  robots?: string
  lang?: string
}) {
  const url = `${SITE}${opts.path === '/' ? '/' : opts.path}`
  document.title = opts.title
  document.documentElement.lang = opts.lang ?? 'th'
  const set = (attr: string, key: string, value: string) => {
    const selector = attr === 'name' || attr === 'property' ? `meta[${attr}="${key}"]` : `link[${attr}="${key}"]`
    let el = document.head.querySelector(selector) as HTMLElement | null
    if (!el) {
      el = document.createElement(attr === 'rel' ? 'link' : 'meta')
      el.setAttribute(attr, key)
      document.head.appendChild(el)
    }
    if (el.tagName === 'LINK') (el as HTMLLinkElement).href = value
    else el.setAttribute('content', value)
  }
  set('name', 'description', opts.description)
  set('name', 'robots', opts.robots ?? 'index,follow')
  set('property', 'og:title', opts.title)
  set('property', 'og:description', opts.description)
  set('property', 'og:url', url)
  set('property', 'og:type', 'website')
  set('property', 'og:locale', 'th_TH')
  set('property', 'og:image', opts.image ?? `${SITE}/mockup/media/web/cta-spa.webp`)
  set('rel', 'canonical', url)
}

export const siteOrigin = SITE
