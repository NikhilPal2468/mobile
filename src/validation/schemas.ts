import { z } from 'zod';

// Step 1: Qualifying Examination (API may return null for optional fields)
export const step1Schema = z.object({
  examCode: z.string().nullish(),
  examName: z.string().nullish(),
  examNameOther: z.string().nullish(),
  registerNumber: z.string().nullish(),
  passingMonth: z.union([z.string(), z.number()]).nullish(),
  passingYear: z.union([z.string(), z.number()]).nullish(),
  schoolCode: z.string().nullish(),
  schoolName: z.string().nullish(),
  passedBoardExam: z.boolean().nullish(),
}).refine((data) => (String(data.examCode ?? '').trim().length > 0), {
  message: 'Exam code is required',
  path: ['examCode'],
});

// Step 2: Applicant Details (API may return null; dateOfBirth can be Date or string)
export const step2Schema = z.object({
  applicantName: z.string().nullish(),
  aadhaarNumber: z.string().nullish(),
  gender: z.string().nullish(),
  category: z.string().nullish(),
  categoryCode: z.string().nullish(),
  dateOfBirth: z.union([z.string(), z.date(), z.null()]).optional(),
  motherName: z.string().nullish(),
  fatherName: z.string().nullish(),
  email: z.string().nullish(),
  ews: z.boolean().nullish(),
})
  .refine((data) => (String(data.applicantName ?? '').trim().length > 0), {
    message: 'Applicant name is required',
    path: ['applicantName'],
  })
  .refine(
    (data) =>
      !data.gender ||
      ['Male', 'Female', 'Others'].includes(String(data.gender)),
    {
      message: 'Gender must be Male, Female or Others',
      path: ['gender'],
    }
  );

// Step 3: Special Categories (API may return null)
export const step3Schema = z.object({
  oec: z.boolean().nullish(),
  linguisticMinority: z.boolean().nullish(),
  linguisticLanguage: z.string().nullish(),
  differentlyAbled: z.boolean().nullish(),
  differentlyAbledPercentage: z.union([z.number(), z.string()]).nullish(),
});

// Step 4: Residence & Address (API may return null)
export const step4Schema = z.object({
  nativeState: z.string().nullish(),
  nativeDistrict: z.string().nullish(),
  nativeTaluk: z.string().nullish(),
  nativePanchayat: z.string().nullish(),
  permanentAddress: z.string().nullish(),
  communicationAddress: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
}).refine(
  (data) => !data.phone || String(data.phone).trim().length === 0 || String(data.phone).length >= 10,
  { message: 'Phone must be at least 10 digits', path: ['phone'] }
);

// Step 5: Grace / Bonus Marks (API may return null)
export const step5Schema = z.object({
  graceMarks: z.boolean().nullish(),
  ncc: z.boolean().nullish(),
  scouts: z.boolean().nullish(),
  spc: z.boolean().nullish(),
  defenceDependent: z.boolean().nullish(),
  littleKitesGrade: z.string().nullish(),
});

// Step 6: Sports (API may return null)
export const step6Schema = z.object({
  sportsStateCount: z.union([z.number(), z.string()]).nullish(),
  sportsDistrictFirst: z.union([z.number(), z.string()]).nullish(),
  sportsDistrictSecond: z.union([z.number(), z.string()]).nullish(),
  sportsDistrictThird: z.union([z.number(), z.string()]).nullish(),
  sportsDistrictParticipation: z.union([z.number(), z.string()]).nullish(),
});

// Step 7: Kalolsavam (API may return null)
export const step7Schema = z.object({
  kalolsavamStateCount: z.union([z.number(), z.string()]).nullish(),
  kalolsavamDistrictA: z.union([z.number(), z.string()]).nullish(),
  kalolsavamDistrictB: z.union([z.number(), z.string()]).nullish(),
  kalolsavamDistrictC: z.union([z.number(), z.string()]).nullish(),
  kalolsavamDistrictParticipation: z.union([z.number(), z.string()]).nullish(),
});

// Step 8: Scholarships (API may return null)
export const step8Schema = z.object({
  ntse: z.boolean().nullish(),
  nmms: z.boolean().nullish(),
  uss: z.boolean().nullish(),
  lss: z.boolean().nullish(),
});

// Step 9: Co-curricular (API may return null; clubs can be array or JSON string)
export const step9Schema = z.object({
  scienceFairGrade: z.string().nullish(),
  mathsFairGrade: z.string().nullish(),
  itFairGrade: z.string().nullish(),
  workExperienceGrade: z.string().nullish(),
  clubs: z.union([z.array(z.string()), z.array(z.any())]).nullish(),
});

// Step 10: SSLC Attempts & Marks (API may return null; subject grades dynamic)
export const step10Schema = z.object({
  sslcAttempts: z.union([z.number(), z.string()]).nullish(),
  previousAttempts: z
    .array(
      z.object({
        regNo: z.string().nullish(),
        month: z.string().nullish(),
        year: z.string().nullish(),
      })
    )
    .nullish(),
  subjectGrade_English: z.string().nullish(),
  subjectGrade_Malayalam: z.string().nullish(),
  subjectGrade_Hindi: z.string().nullish(),
  subjectGrade_Mathematics: z.string().nullish(),
  subjectGrade_Science: z.string().nullish(),
  subjectGrade_SocialScience: z.string().nullish(),
})
  .passthrough()
  .refine(
    (data) => {
      const n = data.sslcAttempts != null ? Number(data.sslcAttempts) : 0;
      if (!n || n < 1) return true;
      const prev = data.previousAttempts;
      if (!prev || !Array.isArray(prev) || prev.length === 0) return true;
      return prev.length === n;
    },
    {
      message: 'Number of previous attempts must match the number of attempts specified',
      path: ['previousAttempts'],
    }
  );

// Step 11: Preferences + final submit disclaimer (API may return null)
export const step11Schema = z.object({
  preferences: z.array(z.any()).nullish(),
  disclaimerAccepted: z.boolean().nullish(),
}).passthrough().refine((data) => data.disclaimerAccepted === true, {
  message: 'You must accept the disclaimer',
  path: ['disclaimerAccepted'],
});

// Step 12: Document Upload (API may return null)
export const step12Schema = z.object({
  documents: z.array(z.any()).nullish(),
}).passthrough();

// Step 13: Declaration (API may return null)
export const step13Schema = z.object({
  disclaimerAccepted: z.boolean().nullish(),
}).passthrough().refine((data) => data.disclaimerAccepted === true, {
  message: 'You must accept the disclaimer',
  path: ['disclaimerAccepted'],
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type Step5FormData = z.infer<typeof step5Schema>;
export type Step6FormData = z.infer<typeof step6Schema>;
export type Step7FormData = z.infer<typeof step7Schema>;
export type Step8FormData = z.infer<typeof step8Schema>;
export type Step9FormData = z.infer<typeof step9Schema>;
export type Step10FormData = z.infer<typeof step10Schema>;
export type Step11FormData = z.infer<typeof step11Schema>;
export type Step12FormData = z.infer<typeof step12Schema>;
export type Step13FormData = z.infer<typeof step13Schema>;
