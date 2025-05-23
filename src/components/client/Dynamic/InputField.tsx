'use client'
import { useState } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '../dynamicForm/ui/Input'
export interface InputProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  name: Path<T>
  placeholder: string
  label?: string
  type?: string
  span?: string
  hidden?: boolean
}

const InputField = <T extends FieldValues>({
  control,
  name,
  type,
  hidden,
  placeholder,
}: InputProps<T>) => {
  const [focusID, setFocusID] = useState(false)

  return (
    <>
      <div className={`${hidden ? 'hidden' : ''}`}>
        <FormField
          control={control}
          name={name}
          render={({ field, fieldState }) => (
            <FormItem className="!w-full relative">
              <FormControl>
                <Input
                  type={type}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onFocus={() => setFocusID(true)}
                  onBlur={() => setFocusID(false)}
                  placeholder={placeholder}
                  className={`transition-transform group-hover:border-primary placeholder:font-light ${
                    focusID ? '!border-primary ' : ''
                  }  max-w-[508px] text-selectedValue  font-normal border-border  focus:!outline-none focus:!ring-0 focus-within:!ring-0 focus-within:!outline-none , flex h-[35px] w-full rounded-sm border  hover:border-primary bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:font-light placeholder:opacity-95 focus-visible:outline-none focus:border-primary focus:border-[2px] focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                />
              </FormControl>
              <FormMessage className="!m-[1px] 3xl: absolute">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}

export default InputField
