export type ToolkitProfile = {
  name: string
  type: string
  phone: string
  address: string
  hours: string
  about: string
  payNote: string
  reviewLink: string
}

export type ToolkitQueueItem = {
  id: string
  date: string
  time: string
  service: string
  firstName: string
}

export type ToolkitGuest = {
  id: string
  name: string
  note: string
  lastVisit: string
}

export type ToolkitState = {
  lang: 'th' | 'en'
  profile: ToolkitProfile
  queue: ToolkitQueueItem[]
  guests: ToolkitGuest[]
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
  reviewLink: '',
}

export function defaultToolkitState(): ToolkitState {
  return {
    lang: 'th',
    profile: emptyProfile,
    queue: [],
    guests: [],
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
      queue: Array.isArray(parsed.queue) ? parsed.queue : [],
      guests: Array.isArray(parsed.guests) ? parsed.guests : [],
    }
  } catch {
    return defaultToolkitState()
  }
}

export function saveToolkit(state: ToolkitState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}
