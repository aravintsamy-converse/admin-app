import { z } from 'zod'
const currentYear = new Date().getFullYear()
const formSchema = z
  .object({
    primaryInformation: z.object({
      jobId: z.string(),
      jobTitle: z.string().min(1, 'Please Select Job Title'),
      experienceRange: z.string().optional(),
      department: z.string().min(1, 'Please Select Department'),
      location: z.string().min(1, 'Please select Location'),
      jobTypeSchema: z
        .object({
          jobType: z.string().min(1, 'Please Select Job Type'),
          value: z.preprocess(
            (val) => {
              if (val === '') return 0
              return val
            },
            z.union([z.number(), z.null()]).optional()
          ),
          unit: z.union([z.string(), z.null()]).optional(),
        })
        .transform((data) => {
          if (
            (data.jobType === 'Contract' || data.jobType === 'Internship') &&
            (!data.value || !data.unit)
          ) {
            return {
              ...data,
              value: data.value ?? 1,
              unit: data.unit ?? 'days',
            }
          }

          if (!['Contract', 'Internship'].includes(data.jobType)) {
            return {
              ...data,
              value: null,
              unit: null,
            }
          }
          return data
        })
        .superRefine((data, ctx) => {
          if (
            (data.jobType === 'Contract' || data.jobType === 'Internship') &&
            (!data.value || data.value <= 0)
          ) {
            ctx.addIssue({
              path: ['value'],
              message: `Please enter ${data.jobType} period`,
              code: z.ZodIssueCode.custom,
            })
          }

          if (
            (data.jobType === 'Contract' || data.jobType === 'Internship') &&
            (!data.unit || data.unit === null)
          ) {
            ctx.addIssue({
              path: ['unit'],
              message: `Please select a unit for ${data.jobType}`,
              code: z.ZodIssueCode.custom,
            })
          }
        }),
    }),
    technicalSkillDetails: z
      .array(
        z.object({
          technicalSkill: z.string().min(1, 'Please Select Technical skill'),
          experience: z.object({
            value: z.preprocess(
              (val) => {
                if (val === '' || val === null || val === undefined)
                  return undefined
                const parsed = Number(val)
                return isNaN(parsed) ? undefined : parsed
              },
              z
                .number({
                  required_error: 'Experience is cannot be empty',
                  invalid_type_error: 'Please enter a valid number',
                })
                .min(0, 'Experience must be at least 0')
                .max(50, 'Experience cannot exceed 50')
            ),
            unit: z.string().min(1, 'Period is required'),
          }),
          mustHave: z.boolean(),
        })
      )
      .min(1, 'At least one skill is required'),
    softSkillDetails: z.array(
      z.object({
        softSkill: z.string().min(1, 'Please Select Soft skill'),
        mustHave: z.boolean(),
      })
    ),
    educationDetails: z.array(
      z.object({
        typeOfQualification: z
          .string()
          .min(1, 'Please select Type of Qualification'),
        nameOfQualification: z
          .string()
          .min(1, 'Please Select Name of Qualification'),
        mustHave: z.boolean(),
      })
    ),
    certificateDetails: z
      .array(
        z
          .object({
            courseName: z.string(),
            expiryMonth: z.string(),
            expiryYear: z.preprocess(
              (val) => {
                if (val === '' || val === null || isNaN(Number(val)))
                  return null
                return Number(val)
              },
              z.union([
                z
                  .number()
                  .min(currentYear, { message: 'Year must be after 2000' })
                  .max(currentYear + 100, {
                    message: `Year must be before ${currentYear + 100}`,
                  }),
                z.null(),
              ])
            ),
            mustHave: z.boolean().default(true),
          })
          .superRefine((data, ctx) => {
            const hasCourse = data.courseName?.trim()

            if (hasCourse) {
              if (!data.courseName || data.courseName === '') {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ['courseName'],
                  message: 'Please select Certificate',
                })
              }

              if (
                !data.expiryMonth ||
                data.expiryMonth.trim() === '' ||
                data.expiryMonth === null
              ) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ['expiryMonth'],
                  message: 'Please select Month',
                })
              }

              if (data.expiryYear === undefined) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ['expiryYear'],
                  message: 'Please enter a valid year',
                })
              }
              if (data.expiryMonth === undefined) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ['expiryYear'],
                  message: 'Please enter a valid Month',
                })
              }
              if (data.expiryYear === null) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ['expiryYear'],
                  message: 'Please Select year',
                })
              }

              if (data.mustHave === undefined) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ['mustHave'],
                  message: 'MustHave is required',
                })
              }
            }
            const { expiryMonth, expiryYear } = data

            if (!expiryMonth || !expiryYear) return

            const paddedMonth = expiryMonth.toString().padStart(2, '0')
            const selectedDate = new Date(`${expiryYear}-${paddedMonth}-01`)
            selectedDate.setHours(0, 0, 0, 0)

            const today = new Date()
            today.setDate(1)
            today.setHours(0, 0, 0, 0)

            if (selectedDate < today) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['expiryMonth'],
                message: 'Past Month not allowed',
              })
            }
          })
      )
      .optional(),
    aboutTheJob: z
      .string()
      .min(1, 'Please enter note for About the Job')
      .refine(
        (val) => {
          const words = val
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0)
          return words.length <= 250
        },
        {
          message: 'Maximum 250 words allowed',
        }
      ),

    responsibilities: z
      .string()
      .refine(
        (val) => {
          const words = val
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0)
          return words.length <= 250
        },
        {
          message: 'Maximum 250 words allowed',
        }
      )
      .optional(),
    additionalInformation: z
      .object({
        travelRequired: z.boolean(),
        noticePeriod: z.string().min(1, 'Please Select NoticePeriod'),
        passportRequired: z.boolean(),
        visaRequired: z.boolean(),
        visaCountry: z.string().optional(),
        visaType: z.string().optional(),
        visaPeriod: z
          .preprocess(
            (val) => {
              if (val === '' || val === null || val === undefined) return null
              const parsed = Number(val)
              return isNaN(parsed) ? undefined : parsed
            },
            z.union([
              z.number().max(60, 'visaPeriod cannot exceed 60'),
              z.null(),
            ])
          )
          .optional(),
        validFrom: z.union([z.date(), z.null()]).optional(),
        validTo: z.union([z.date(), z.null()]).optional(),
        salaryRange: z.string().min(1, 'Please Select Salary Range'),
        salaryFrom: z.preprocess(
          (val) => {
            if (val === '' || val === null || val === undefined)
              return undefined
            const parsed = Number(val)
            return isNaN(parsed) ? undefined : parsed
          },
          z.union([
            z
              .number({
                required_error: 'Please enter Salary Range From',
                invalid_type_error: 'Please enter a valid number',
              })
              .min(1, 'Please enter Salary Range From')
              .max(9999999999, 'Please enter a salary below 10 digits'),
            z.null(),
          ])
        ),
        salaryTo: z.preprocess(
          (val) => {
            if (val === '' || val === null || val === undefined)
              return undefined
            const parsed = Number(val)
            return isNaN(parsed) ? undefined : parsed
          },
          z.union([
            z
              .number({
                required_error: 'Please enter Salary Range To',
                invalid_type_error: 'Please enter a valid number',
              })
              .min(1, 'Please enter Salary Range TO')
              .max(9999999999, 'Please enter a salary below 10 digits'),
            z.null(),
          ])
        ),
        ageGroup: z.string().min(1, 'Please Select Age Group '),
        shiftPreference: z.string().min(1, 'Please Select Shift you Prefer'),
        industryType: z.array(z.string()).optional(),
      })

      .superRefine((data, ctx) => {
        if (data.visaRequired && data.passportRequired) {
          if (!data.visaCountry || data.visaCountry.trim().length === 0) {
            ctx.addIssue({
              path: ['visaCountry'],
              message: 'Please select VISA Country',
              code: z.ZodIssueCode.custom,
            })
          }

          if (!data.visaType || data.visaType.trim().length === 0) {
            ctx.addIssue({
              path: ['visaType'],
              message: 'Please select VISA Type',
              code: z.ZodIssueCode.custom,
            })
          }

          if (!data.visaPeriod || data.visaPeriod <= 0) {
            ctx.addIssue({
              path: ['visaPeriod'],
              message: 'Please enter VISA Period',
              code: z.ZodIssueCode.custom,
            })
          }

          if (!data.validFrom) {
            ctx.addIssue({
              path: ['validFrom'],
              message: 'Visa From date is required',
              code: z.ZodIssueCode.custom,
            })
          } else if (data.validFrom < new Date()) {
            ctx.addIssue({
              path: ['validFrom'],
              message: 'Visa From date cannot be in the past',
              code: z.ZodIssueCode.custom,
            })
          }

          if (!data.validTo) {
            ctx.addIssue({
              path: ['validTo'],
              message: 'Visa To date is required',
              code: z.ZodIssueCode.custom,
            })
          }

          if (
            data.validFrom &&
            data.validTo &&
            data.validTo <= data.validFrom
          ) {
            ctx.addIssue({
              path: ['validTo'],
              message: 'Visa To must be after Visa From',
              code: z.ZodIssueCode.custom,
            })
          }
          if (
            data.salaryTo &&
            data.salaryFrom &&
            data.salaryTo <= data.salaryFrom
          ) {
            ctx.addIssue({
              path: ['salaryTo'],
              message: 'Salary To should be greater than Salary From.',
              code: z.ZodIssueCode.custom,
            })
          }
        }
      }),

    jobPreferences: z
      .string()
      .refine(
        (val) => {
          const words = val
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0)
          return words.length <= 250
        },
        {
          message: 'Maximum 250 words allowed',
        }
      )
      .optional(),
    keyBenefits: z
      .string()
      .refine(
        (val) => {
          const words = val
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0)
          return words.length <= 250
        },
        {
          message: 'Maximum 250 words allowed',
        }
      )
      .optional(),
    contactInformation: z.object({
      contactPerson: z.string().min(1, 'Please Select Contact Person Name'),
      phoneNumber: z.number().optional(),
      email: z.string().optional(),
      applicationEndDate: z.union([z.date(), z.null()]).optional(),
      applyLink: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    const experience = data.primaryInformation?.experienceRange?.trim()
    const industryType = data.additionalInformation?.industryType ?? []
    if (experience && industryType.length === 0) {
      ctx.addIssue({
        path: ['additionalInformation', 'industryType'],
        message: 'Please select Industry Type if experience range is provided',
        code: z.ZodIssueCode.custom,
      })
    }
  })

export { formSchema }

export type FormValues = z.infer<typeof formSchema>
