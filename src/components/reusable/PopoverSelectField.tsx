'use client'
import React, { useState } from 'react'
import { Controller, FieldValues } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ChevronDown, Loader } from 'lucide-react'
import { PopoverSelectFieldProps } from '@/Types/components/client/types'

const PopoverSelectField = <T extends FieldValues>({
  control,
  name,
  label,
  span,
  hidden,
  options,
  placeholder = 'Select Option',
  searchText,
  fetchUser,
}: PopoverSelectFieldProps<T>) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className={`${hidden ? 'hidden' : ''}`}>
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="font-normal opacity-95 text-foreground text-[15px]">
                {label}
                <span className="opacity-55">{span}</span>{' '}
              </FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`3xl:w-[508px] w-full !mt-[6px]  pl-[14px]  h-[35px] text-selectedValue outline-none    justify-between rounded-sm shadow-none  transition-all hover:border-primary placeholder:font-light   font-normal text-sm border ${open ? 'border-primary' : 'border-border'}  hover:bg-background  `}
                    >
                      {field.value ? (
                        <span className="text-selectedValue ">
                          {field.value}
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-light  ">
                          {placeholder}
                        </span>
                      )}
                      <ChevronDown
                        className={`transition-transform duration-200 text-selectedValue ${
                          open ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 w-[var(--radix-popover-trigger-width)] !shadow-custom
 rounded-sm  border-none  "
                  >
                    <Command defaultValue={field.value}>
                      <CommandInput
                        className="placeholder:text-sm placeholder:font-light  pl-3 pt-3 "
                        placeholder={`Search by ${searchText}`}
                      />
                      {!options ? (
                        <div className="flex justify-center p-2">
                          <Loader
                            data-testid="loader"
                            className="animate-spin"
                          />
                        </div>
                      ) : (
                        <CommandList className="p-1  max-h-[250px] secondary-scrolls  overflow-y-auto ">
                          {options.map((option) => (
                            <CommandItem
                              className={` pl-11 py-2 rounded-none hover:!bg-accent  text-selectedValue hover:!text-accent-foreground  hover:font-medium 
                           data-[state=checked]:!bg-accent  data-[state=checked]:!text-accent-foreground  ${
                             field.value.toLowerCase() ===
                             option.name.toLowerCase()
                               ? ' text-accent-foreground bg-accent '
                               : ''
                           }`}
                              key={option.id}
                              onSelect={() => {
                                field.onChange(option.name)
                                setOpen(false)
                                if (
                                  name.includes(
                                    'contactInformation.contactPerson'
                                  )
                                ) {
                                  fetchUser?.(option.id)
                                }
                              }}
                            >
                              {option.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="!m-[1px] absolute ">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}

export default PopoverSelectField
