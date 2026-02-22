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
  guardianName: z.string().nullish(),
  caste: z.string().nullish(),
  religion: z.string().nullish(),
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
  )
  .refine(
    (data) =>
      !data.category ||
      ['General', 'OBC', 'SC', 'ST'].includes(String(data.category)),
    {
      message: 'Category must be General, OBC, SC or ST',
      path: ['category'],
    }
  );

// Step 3: Special Categories (API may return null)
export const step3Schema = z.object({
  oec: z.boolean().nullish(),
  linguisticMinority: z.boolean().nullish(),
  linguisticLanguage: z.string().nullish(),
  differentlyAbled: z.boolean().nullish(),
  differentlyAbledTypes: z.array(z.string()).nullish(),
  differentlyAbledPercentage: z.union([z.number(), z.string()]).nullish(),
}).superRefine((data, ctx) => {
  const types = data.differentlyAbledTypes || [];
  const hasTypes = Array.isArray(types) && types.length > 0;
  const raw = data.differentlyAbledPercentage;
  const num =
    raw == null || raw === ''
      ? null
      : typeof raw === 'number'
        ? raw
        : Number(String(raw));

  if (hasTypes) {
    if (num == null || Number.isNaN(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['differentlyAbledPercentage'],
        message: 'Percentage is required when differently abled is selected',
      });
      return;
    }
    if (num < 0 || num > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['differentlyAbledPercentage'],
        message: 'Percentage must be between 0 and 100',
      });
    }
  }
});

// Step 4: Residence & Address (API may return null)
export const step4Schema = z.object({
  nativeState: z.string().nullish(),
  nativeDistrict: z.string().nullish(),
  nativeTaluk: z.string().nullish(),
  nativePanchayat: z.string().nullish(),
  nativeCountry: z.string().nullish(),
  permanentAddress: z.string().nullish(),
  permanentPinCode: z.string().nullish(),
  communicationAddress: z.string().nullish(),
  communicationPinCode: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
}).refine(
  (data) => !data.phone || String(data.phone).trim().length === 0 || String(data.phone).length >= 10,
  { message: 'Phone must be at least 10 digits', path: ['phone'] }
).superRefine((data, ctx) => {
  const pin1 = String(data.permanentPinCode ?? '').trim();
  const pin2 = String(data.communicationPinCode ?? '').trim();
  if (!/^\d{6}$/.test(pin1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['permanentPinCode'],
      message: 'Permanent PIN code must be exactly 6 digits',
    });
  }
  if (!/^\d{6}$/.test(pin2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['communicationPinCode'],
      message: 'Communication PIN code must be exactly 6 digits',
    });
  }
});

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
  scienceFairCounts: z
    .object({
      A: z.union([z.number(), z.string()]).nullish(),
      B: z.union([z.number(), z.string()]).nullish(),
      C: z.union([z.number(), z.string()]).nullish(),
      D: z.union([z.number(), z.string()]).nullish(),
      E: z.union([z.number(), z.string()]).nullish(),
    })
    .nullish(),
  mathsFairCounts: z
    .object({
      A: z.union([z.number(), z.string()]).nullish(),
      B: z.union([z.number(), z.string()]).nullish(),
      C: z.union([z.number(), z.string()]).nullish(),
      D: z.union([z.number(), z.string()]).nullish(),
      E: z.union([z.number(), z.string()]).nullish(),
    })
    .nullish(),
  itFairCounts: z
    .object({
      A: z.union([z.number(), z.string()]).nullish(),
      B: z.union([z.number(), z.string()]).nullish(),
      C: z.union([z.number(), z.string()]).nullish(),
      D: z.union([z.number(), z.string()]).nullish(),
      E: z.union([z.number(), z.string()]).nullish(),
    })
    .nullish(),
  workExperienceCounts: z
    .object({
      A: z.union([z.number(), z.string()]).nullish(),
      B: z.union([z.number(), z.string()]).nullish(),
      C: z.union([z.number(), z.string()]).nullish(),
      D: z.union([z.number(), z.string()]).nullish(),
      E: z.union([z.number(), z.string()]).nullish(),
    })
    .nullish(),
  socialScienceFairCounts: z
    .object({
      A: z.union([z.number(), z.string()]).nullish(),
      B: z.union([z.number(), z.string()]).nullish(),
      C: z.union([z.number(), z.string()]).nullish(),
      D: z.union([z.number(), z.string()]).nullish(),
      E: z.union([z.number(), z.string()]).nullish(),
    })
    .nullish(),
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
  subjectGrade_LangI: z.string().nullish(),
  subjectGrade_LangII: z.string().nullish(),
  subjectGrade_Eng: z.string().nullish(),
  subjectGrade_Hin: z.string().nullish(),
  subjectGrade_SS: z.string().nullish(),
  subjectGrade_Phy: z.string().nullish(),
  subjectGrade_Che: z.string().nullish(),
  subjectGrade_Bio: z.string().nullish(),
  subjectGrade_Maths: z.string().nullish(),
  subjectGrade_IT: z.string().nullish(),
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
