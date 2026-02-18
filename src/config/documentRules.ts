/**
 * Document upload rules for Step 12. Each entry defines when a document is required
 * and optional help text based on merged stepData (earlier form answers).
 */

export type DocumentRule = {
  type: string;
  labelKey: string;
  alwaysRequired: boolean;
  isRequired: (stepData: any) => boolean;
  getHelpTextKey: (stepData: any) => string | null;
};

const hasValue = (v: any) =>
  v !== null && v !== undefined && v !== '' && (typeof v !== 'number' || !Number.isNaN(v));

const hasSportsParticipation = (d: any) =>
  hasValue(d?.sportsStateCount) ||
  hasValue(d?.sportsDistrictFirst) ||
  hasValue(d?.sportsDistrictSecond) ||
  hasValue(d?.sportsDistrictThird) ||
  hasValue(d?.sportsDistrictParticipation);

const hasKalolsavamParticipation = (d: any) =>
  hasValue(d?.kalolsavamStateCount) ||
  hasValue(d?.kalolsavamDistrictA) ||
  hasValue(d?.kalolsavamDistrictB) ||
  hasValue(d?.kalolsavamDistrictC) ||
  hasValue(d?.kalolsavamDistrictParticipation);

const hasScholarship = (d: any) =>
  d?.ntse === true || d?.nmms === true || d?.uss === true || d?.lss === true;

const hasReservationOrEws = (d: any) =>
  d?.ews === true || hasValue(d?.category) || hasValue(d?.categoryCode);

export const DOCUMENT_RULES: DocumentRule[] = [
  {
    type: 'AADHAAR',
    labelKey: 'form.step12.aadhaar',
    alwaysRequired: true,
    isRequired: () => true,
    getHelpTextKey: () => null,
  },
  {
    type: 'SSLC_MARKSHEET',
    labelKey: 'form.step12.sslcMarksheet',
    alwaysRequired: true,
    isRequired: () => true,
    getHelpTextKey: () => null,
  },
  {
    type: 'CATEGORY_CERTIFICATE',
    labelKey: 'form.step12.categoryCertificate',
    alwaysRequired: false,
    isRequired: (d) => hasValue(d?.category) || hasValue(d?.categoryCode),
    getHelpTextKey: (d) =>
      hasValue(d?.category) || hasValue(d?.categoryCode) ? 'form.step12.requiredBecauseCategory' : null,
  },
  {
    type: 'RESERVATION_CERTIFICATE',
    labelKey: 'form.step12.reservationCertificate',
    alwaysRequired: false,
    isRequired: hasReservationOrEws,
    getHelpTextKey: (d) => (hasReservationOrEws(d) ? 'form.step12.requiredBecauseReservation' : null),
  },
  {
    type: 'SPORTS_CERTIFICATE',
    labelKey: 'form.step12.sportsCertificate',
    alwaysRequired: false,
    isRequired: hasSportsParticipation,
    getHelpTextKey: (d) => (hasSportsParticipation(d) ? 'form.step12.requiredBecauseSports' : null),
  },
  {
    type: 'KALOLSAVAM_CERTIFICATE',
    labelKey: 'form.step12.kalolsavamCertificate',
    alwaysRequired: false,
    isRequired: hasKalolsavamParticipation,
    getHelpTextKey: (d) =>
      hasKalolsavamParticipation(d) ? 'form.step12.requiredBecauseKalolsavam' : null,
  },
  {
    type: 'SCHOLARSHIP_CERTIFICATE',
    labelKey: 'form.step12.scholarshipCertificate',
    alwaysRequired: false,
    isRequired: hasScholarship,
    getHelpTextKey: (d) => (hasScholarship(d) ? 'form.step12.requiredBecauseScholarship' : null),
  },
  {
    type: 'DISABILITY_CERTIFICATE',
    labelKey: 'form.step12.disabilityCertificate',
    alwaysRequired: false,
    isRequired: (d) => d?.differentlyAbled === true,
    getHelpTextKey: (d) => (d?.differentlyAbled === true ? 'form.step12.requiredBecauseDisability' : null),
  },
];
