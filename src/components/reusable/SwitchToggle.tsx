'use client'
import React from 'react'
import { FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { SwitchToggleProps } from '@/Types/components/client/types'

const SwitchToggle = <T extends FieldValues>({
  control,
  name,
  label,
  span,
  className,
  hidden,
}: SwitchToggleProps<T>) => {
  return (
    <>
      <div className={`${hidden ? 'hidden' : ''} w-full`}>
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem
              className={`flex  flex-col justify-between items-start gap-[6px]  ${className ? className : ''}`}
            >
              <FormLabel className="font-normal opacity-95 text-foreground text-[15px]">
                {label}
                <span className="opacity-55">{span}</span>
              </FormLabel>
              <FormControl>
                <Switch
                  className="h-[17px] w-[32px] "
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
      </div>
    </>
  )
}

export default SwitchToggle
