import { useForm } from 'react-hook-form'
import { formSchema, FormValues } from './formSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { contractOptions } from '@/mockData/JobDescriptionForm'

export function useFormConfig() {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      primaryInformation: {
        jobId: 'JI0001',
        jobTitle: '',
        experienceRange: '',
        department: '',
        location: '',
        jobTypeSchema: {
          jobType: '',
          value: null,
          unit: null,
        },
      },
      technicalSkillDetails: [
        {
          technicalSkill: '',
          experience: {
            value: 0,
            unit: contractOptions[0].value,
          },
          mustHave: true,
        },
      ],
      softSkillDetails: [
        {
          softSkill: '',
          mustHave: true,
        },
      ],
      educationDetails: [
        {
          typeOfQualification: '',
          nameOfQualification: '',
          mustHave: true,
        },
      ],
      certificateDetails: [
        {
          courseName: '',
          expiryMonth: '',
          expiryYear: null,
          mustHave: true,
        },
      ],
      aboutTheJob: '',
      responsibilities: '',
      additionalInformation: {
        travelRequired: false,
        noticePeriod: '',
        passportRequired: false,
        visaRequired: false,
        visaCountry: '',
        visaType: '',
        visaPeriod: null,
        validFrom: null,
        validTo: null,
        salaryRange: '',
        salaryFrom: null,
        salaryTo: null,
        ageGroup: '',
        shiftPreference: '',
        industryType: [],
      },
      jobPreferences: '',
      keyBenefits: '',
      contactInformation: {
        contactPerson: '',
        phoneNumber: 9874563210,
        email: 'example@example.com',
        applicationEndDate: null,
        applyLink:
          'https://careers.companyname.com/job/software-developer-12345',
      },
    },
  })
}
