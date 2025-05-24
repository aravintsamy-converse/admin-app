'use client'
import React from 'react'
import { NonEditableInputFiledProps } from '@/Types/components/client/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FieldValues } from 'react-hook-form'

const NonEditableInputFiled = <T extends FieldValues>({
  control,
  name,
  span,
  label,
  value,
}: NonEditableInputFiledProps<T>) => {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-normal  text-foreground text-[15px]  leading-none relative">
              {label}
              <span className="absolute opacity-55">{span}</span>
            </FormLabel>
            <FormControl className="">
              <Input
                className="rounded-sm bg-muted 3xl:w-[508px] text-selectedValue shadow-none !opacity-100 !mt-[5px] border-border  3xl:h-[35px] "
                type="text"
                {...field}
                value={value ? value : field.value}
                disabled
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default NonEditableInputFiled
