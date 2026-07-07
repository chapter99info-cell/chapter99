import type { PackageTier, Project } from '../types/agency'

export const PACKAGE_TIERS: PackageTier[] = ['STARTER', 'PROFESSIONAL', 'ULTIMATE']

export function isUltimateTier(tier: PackageTier): boolean {
  return tier === 'ULTIMATE'
}

/** Production photography/video add-ons are Ultimate-only per pricing spec */
export function canUseProductionAddons(tier: PackageTier): boolean {
  return tier === 'ULTIMATE'
}

/** Client-facing AI chatbot add-on — Ultimate tier only */
export function canEnableAiAddon(tier: PackageTier): boolean {
  return tier === 'ULTIMATE'
}

export function assertAiAddonAllowed(project: Pick<Project, 'packageTier' | 'aiAddonEnabled'>): void {
  if (project.aiAddonEnabled && !canEnableAiAddon(project.packageTier)) {
    throw new Error('AI add-on is only available on the Ultimate Business tier.')
  }
}

/** No client-facing AI routes may run for sub-Ultimate tiers */
export function isClientFacingAiAllowed(project: Pick<Project, 'packageTier' | 'aiAddonEnabled'>): boolean {
  return project.packageTier === 'ULTIMATE' && project.aiAddonEnabled
}

export function tierLabel(tier: PackageTier): string {
  switch (tier) {
    case 'STARTER':
      return 'Starter'
    case 'PROFESSIONAL':
      return 'Professional'
    case 'ULTIMATE':
      return 'Ultimate Business'
    default:
      return tier
  }
}
