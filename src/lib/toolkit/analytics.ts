export type TrackEvent =
  | 'tool_opened'
  | 'tool_completed'
  | 'tool_result_copied'
  | 'tool_result_shared'
  | 'business_check_completed'
  | 'tool_to_contact_clicked'
  | 'tool_to_packages_clicked'

export type TrackMeta = Record<string, string | number | boolean | null | undefined>

const events: { event: TrackEvent; meta: TrackMeta }[] = []

export function track(event: TrackEvent, meta: TrackMeta = {}) {
  const safe: TrackMeta = { ...meta }
  events.push({ event, meta: safe })
  if (import.meta.env.DEV && (window as Window & { __C99_DEBUG?: boolean }).__C99_DEBUG) {
    console.log('[event]', event, safe)
  }
}

export function getTrackedEvents() {
  return events.slice()
}
