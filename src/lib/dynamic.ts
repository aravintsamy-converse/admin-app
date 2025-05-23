import { defaultLayout } from '@/mockData/DynamicNav'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
type FormData = z.infer<typeof formSchema>
export function useFormConfig() {
  return useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
}

function getFieldSchema(field: any) {
  switch (field.type) {
    case 'text':
      return field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional()

    case 'email':
      return field.required
        ? z.string().email(`${field.label} must be a valid email`)
        : z.string().email().optional()

    case 'number':
      if (field.required) {
        return z.preprocess(
          (val) => {
            if (typeof val === 'string' && val.trim() === '') return undefined
            const n = Number(val)
            return isNaN(n) ? val : n
          },
          z.number({ invalid_type_error: `${field.label} must be a number` })
        )
      } else {
        return z
          .union([
            z.preprocess(
              (val) => {
                if (typeof val === 'string' && val.trim() === '')
                  return undefined
                const n = Number(val)
                return isNaN(n) ? val : n
              },
              z.number({
                invalid_type_error: `${field.label} must be a number`,
              })
            ),
            z.undefined(),
          ])
          .optional()
      }

    case 'date':
      return field.required
        ? z.date({ required_error: `${field.label} is required` })
        : z.union([z.date(), z.null()]).optional()

    case 'switch':
      return field.required ? z.boolean() : z.boolean().optional()

    case 'dropdown':
    case 'create_dropdown':
      return field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional()

    case 'search_dropdown':
      return field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional()

    default:
      return z.any()
  }
}

const shape = defaultLayout.form.fields.reduce(
  (acc, field) => {
    acc[field.id] = getFieldSchema(field)
    return acc
  },
  {} as Record<string, any>
)

export const formSchema = z.object(shape)

export const defaultValues = defaultLayout.form.fields.reduce(
  (acc, field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'search_dropdown':
      case 'date':
        acc[field.id] = field.value ?? ''
        break
      case 'number':
      case 'dropdown':
      case 'create_dropdown':
        acc[field.id] = field.value ?? undefined
        break
      case 'switch':
        acc[field.id] = field.value ?? false
        break
      default:
        acc[field.id] = field.value ?? undefined
    }
    return acc
  },
  {} as Record<string, any>
)
