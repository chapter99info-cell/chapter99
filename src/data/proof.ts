export type LiveWork = {
  name: string
  url: string
  image: string
  permissionDate: string
  status: 'live'
}

export type Review = {
  author: string
  text: string
  sourceUrl: string
  platform: 'google' | 'facebook'
  permissionDate: string
}

export const liveWorks: LiveWork[] = []

export const reviews: Review[] = []

export const company: { abn?: string } = {}
