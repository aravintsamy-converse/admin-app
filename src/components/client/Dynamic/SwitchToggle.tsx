'use client'
import { Control, FieldValues, Path } from 'react-hook-form'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'

export interface SwitchTogglePropsNav<T extends FieldValues = FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  span?: string
  onCheckedChange?: (checked: boolean) => void
  className?: string
  hidden?: boolean
  checked?: boolean
}

const SwitchToggle = <T extends FieldValues>({
  control,
  name,
  className,
  hidden,
  checked,
  onCheckedChange,
}: SwitchTogglePropsNav<T>) => {
  return (
    <div className={`${hidden ? 'hidden' : ''} w-full`}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem
            className={`flex flex-col justify-between items-start gap-[6px] ${className || ''}`}
          >
            <FormControl>
              <Switch
                className="h-[17px] w-[32px]"
                checked={checked !== undefined ? checked : field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked)
                  onCheckedChange?.(checked)
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}

export default SwitchToggle
