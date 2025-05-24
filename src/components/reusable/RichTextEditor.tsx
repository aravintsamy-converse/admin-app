'use client'
import React from 'react'
import { FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import CustomeRichTextEditor from '@/components/client/external/CustomeRichTextEditor'
import { RichTextEditorProps } from '@/Types/components/client/types'

const RichTextEditor = <T extends FieldValues>({
  control,
  name,
}: RichTextEditorProps<T>) => {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <CustomeRichTextEditor
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default RichTextEditor
