import type { Billing, PackageTier } from '../types/agency'
import { canUseProductionAddons } from './tierRules'

export type BillingLineInput = {
  basePackageAmountAud: number
  photographyFeeAud: number
  videoFeeAud: number
  aiAddonMonthlyFeeAud: number | null
}

export function computeBillingTotal(
  input: BillingLineInput,
  packageTier: PackageTier
): { totalAmountAud: number; gstAmountAud: number } {
  const photo = canUseProductionAddons(packageTier) ? input.photographyFeeAud : 0
  const video = canUseProductionAddons(packageTier) ? input.videoFeeAud : 0
  const aiFee = packageTier === 'ULTIMATE' ? (input.aiAddonMonthlyFeeAud ?? 0) : 0
  const totalAmountAud =
    Math.round((input.basePackageAmountAud + photo + video + aiFee) * 100) / 100
  const gstAmountAud = Math.round(totalAmountAud * 0.1 * 100) / 100
  return { totalAmountAud, gstAmountAud }
}

export function billingLineInputFromRecord(
  bill: Partial<Billing> | undefined,
  packageTier: PackageTier
): BillingLineInput {
  const base = bill?.basePackageAmountAud ?? bill?.totalAmountAud ?? 0
  return {
    basePackageAmountAud: base,
    photographyFeeAud: canUseProductionAddons(packageTier) ? (bill?.photographyFeeAud ?? 0) : 0,
    videoFeeAud: canUseProductionAddons(packageTier) ? (bill?.videoFeeAud ?? 0) : 0,
    aiAddonMonthlyFeeAud:
      packageTier === 'ULTIMATE' ? (bill?.aiAddonMonthlyFeeAud ?? null) : null,
  }
}
