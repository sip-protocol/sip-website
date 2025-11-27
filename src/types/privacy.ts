/**
 * Privacy level for SIP transactions
 *
 * TODO: Replace with @sip-protocol/types when published to npm
 * Temporarily inlined for Docker builds
 */
export enum PrivacyLevel {
  /** Standard public transaction - no privacy guarantees */
  TRANSPARENT = 'transparent',
  /** Full privacy via Zcash shielded pool */
  SHIELDED = 'shielded',
  /** Privacy with viewing key for compliance/audit */
  COMPLIANT = 'compliant',
}
