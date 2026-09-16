import { checklistItems, type PhotoSlot } from '../data/toolkit'

export type ToolkitProfile = {
  name: string
  type: string
  phone: string
  address: string
  hours: string
  about: string
  payNote: string
}

export type ToolkitService = {
  id: string
  name: string
  duration: string
  price: string
  description: string
  photoId: string
}

export type ToolkitPhoto = {
  id: string
  name: string
  dataUrl: string
  slots: PhotoSlot[]
}

export type ToolkitState = {
  lang: 'th' | 'en'
  profile: ToolkitProfile
  services: ToolkitService[]
  photos: ToolkitPhoto[]
  checklist: Record<string, boolean>
}

const KEY = 'c99-free-toolkit-v1'

const emptyProfile: ToolkitProfile = {
  name: '',
  type: 'ร้านนวด / Massage',
  phone: '',
  address: '',
  hours: '',
  about: '',
  payNote: '',
}

function defaultChecklist() {
  return Object.fromEntries(checklistItems.map((i) => [i.id, false])) as Record<string, boolean>
}

export function defaultToolkitState(): ToolkitState {
  return {
    lang: 'th',
    profile: emptyProfile,
    services: [],
    photos: [],
    checklist: defaultChecklist(),
  }
}

export function loadToolkit(): ToolkitState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultToolkitState()
    const parsed = JSON.parse(raw) as Partial<ToolkitState>
    return {
      ...defaultToolkitState(),
      ...parsed,
      profile: { ...emptyProfile, ...parsed.profile },
      services: parsed.services ?? [],
      photos: parsed.photos ?? [],
      checklist: { ...defaultChecklist(), ...parsed.checklist },
    }
  } catch {
    return defaultToolkitState()
  }
}

export function saveToolkit(state: ToolkitState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function compressImage(file: File, max = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('canvas'))
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.72))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image'))
    }
    img.src = url
  })
}

export function deriveChecklist(state: ToolkitState): Record<string, boolean> {
  const p = state.profile
  return {
    profile: Boolean(p.name && p.type),
    services: state.services.length > 0,
    hours: Boolean(p.hours),
    photos: state.photos.length > 0,
    policy: Boolean(state.checklist.policy),
    website: Boolean(p.about),
    contact: Boolean(p.phone || p.address),
    pay: Boolean(p.payNote),
  }
}
