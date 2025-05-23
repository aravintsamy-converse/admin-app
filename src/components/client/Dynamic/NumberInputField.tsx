'use client'
import { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { NumberInputProps } from '@/Types/components/client/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const NumberInput = <T extends FieldValues>({
  control,
  name,
  hidden,
  placeholder,
}: NumberInputProps<T>) => {
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
                  type="text"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '')
                    field.onChange(numericValue ? Number(numericValue) : '')
                  }}
                  onFocus={() => setFocusID(true)}
                  onBlur={() => setFocusID(false)}
                  placeholder={placeholder}
                  className={`transition-transform group-hover:border-primary placeholder:font-light ${
                    focusID ? '!border-primary ' : ''
                  }  max-w-[508px] text-selectedValue  font-normal border-border  focus:!outline-none focus:!ring-0 focus-within:!ring-0 focus-within:!outline-none , flex h-[35px] mt-[2px] w-full rounded-sm border  hover:border-primary bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:font-light placeholder:opacity-95 focus-visible:outline-none focus:border-primary focus:border-[2px] focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
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

export default NumberInput
