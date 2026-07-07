/**
 * Client-facing AI gateway — Ultimate + ai_addon_enabled only.
 * Admin Briefing uses claudeApi.ts separately (agency keys, admin-only).
 */
import { getProjectByokKey } from './agencyService'
import { callClaudeApi } from './claudeApi'
import type { Project } from '../types/agency'
import { isClientFacingAiAllowed } from './tierRules'

export async function callClientFacingAi(
  project: Pick<Project, 'id' | 'packageTier' | 'aiAddonEnabled' | 'byokKeyConfigured'>,
  prompt: string
): Promise<string> {
  if (!isClientFacingAiAllowed(project)) {
    throw new Error('Client-facing AI is not enabled for this package tier.')
  }

  if (project.byokKeyConfigured) {
    const byok = await getProjectByokKey(project.id)
    if (!byok) {
      throw new Error('BYOK key configured but could not be retrieved.')
    }
    // Future: route to client chatbot endpoint with BYOK — not wired to portal yet
    throw new Error('Client BYOK chatbot routing is not deployed on the public site yet.')
  }

  // Agency-managed key path — billing must include ai_addon_monthly_fee_aud (enforced in ProjectSettings)
  return callClaudeApi(prompt)
}
