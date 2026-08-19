/**
 * Google Sheets adapter — blocked until an OAuth Client ID is provided.
 */
import type { DataAdapter } from './types'

const blocked = () => {
  throw new Error('Google Sheets sync is blocked: no OAuth Client ID has been created yet.')
}

export const sheetsAdapter: DataAdapter = {
  id: 'sheets',
  restoreSession: async () => null,
  needsOwner: async () => true,
  load: blocked,
  save: blocked,
  login: blocked,
  logout: async () => {},
  bootstrapOwner: blocked,
  addStaff: blocked,
  fetchByToken: async () => null,
  confirmToken: async () => false,
  subscribe: () => () => {},
}
