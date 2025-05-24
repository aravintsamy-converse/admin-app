'use client'
import React, { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { NumberInputProps } from '@/Types/components/client/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const NumberInput = <T extends FieldValues>({
  control,
  name,
  label,
  hidden,
  placeholder,
  span,
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
              <FormLabel className="font-normal opacity-95 text-foreground text-[15px]">
                {label} <span className="opacity-55">{span}</span>
              </FormLabel>

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
                  } !mt-[6px] h-[35px] 3xl:w-[508px] text-selectedValue shadow-none font-normal border border-border rounded-sm focus:!outline-none focus:!ring-0 focus-within:!ring-0 focus-within:!outline-none`}
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
