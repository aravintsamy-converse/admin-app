'use client'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Check, ChevronDown, Loader } from 'lucide-react'
import CloseIcon from '@/components/client/icons/CloseIcon'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
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
import { SelectCreateFieldProps } from '@/Types/components/client/types'
import { MultiSelectPlusIcon } from '../icons/PlusIcon'

const MultiSelectComboboxField = ({
  name,
  span,
  label,
  options = [],
  fetchOptions,
}: SelectCreateFieldProps) => {
  const { control } = useFormContext()
  const [titles, setTitles] = useState<{ id: number; name: string }[]>(options)
  const [loading, setLoading] = useState(fetchOptions ? true : false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [maxVisibleOptions] = useState(3)

  useEffect(() => {
    if (fetchOptions) {
      setTitles(fetchOptions)
      setLoading(false)
      setError(null)
    }
  }, [fetchOptions])

  return (
    <>
      <div className="relative h-max">
        <Controller
          control={control}
          name={name}
          defaultValue={[]}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="font-normal text-foreground text-[15px]">
                {label}
                <span className="opacity-55">{span}</span>
              </FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`text-selectedValue outline-none w-full 3xl:w-[508px] !mt-[6px] pl-[14px] h-[35px] justify-between rounded-sm shadow-none transition-all duration-200 hover:border-primary font-normal text-sm border ${open ? 'border-primary' : 'border-border'} hover:bg-background`}
                    >
                      <div className="flex flex-wrap gap-2 items-center">
                        {field.value
                          ?.slice(0, maxVisibleOptions)
                          .map((selected: string) => (
                            <div
                              key={selected}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent text-accent-foreground"
                            >
                              <span className="!text-xs">{selected}</span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation()

                                  const newValue = field.value.filter(
                                    (v: string) => v !== selected
                                  )
                                  field.onChange(newValue)
                                }}
                                className="text-xs cursor-pointer"
                              >
                                <CloseIcon className="!h-3 !w-3" />
                              </span>
                            </div>
                          ))}
                        {field.value?.length > maxVisibleOptions && (
                          <span className="text-accent-foreground bg-accent px-3 rounded-sm flex items-center text-xs py-1 ">
                            <span>
                              <MultiSelectPlusIcon />
                            </span>
                            {field.value.length - maxVisibleOptions}
                          </span>
                        )}
                        {field.value.length == 0 && (
                          <span className="text-muted-foreground font-light">
                            Select Option
                          </span>
                        )}
                      </div>
                      {/* Chevron Icon */}
                      <ChevronDown
                        className={`transition-transform duration-200 text-muted-foreground ${open ? 'rotate-180' : 'rotate-0'}`}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)] !shadow-custom rounded-sm border-none">
                    <Command defaultValue={field.value}>
                      <CommandInput
                        className="placeholder:text-sm placeholder:font-light pl-3 pt-3"
                        placeholder="Search by Job"
                      />
                      {loading ? (
                        <div className="flex justify-center p-2">
                          <Loader className="animate-spin" />
                        </div>
                      ) : error ? (
                        <div className="text-red-500 p-2">{error}</div>
                      ) : (
                        <CommandGroup>
                          {titles.map((option) => (
                            <CommandItem
                              data-testid={`option-${option.name}`}
                              key={option.id}
                              onSelect={() => {
                                const newValue = field.value.includes(
                                  option.name
                                )
                                  ? field.value.filter(
                                      (v: string) => v !== option.name
                                    )
                                  : [...field.value, option.name]
                                field.onChange(newValue)
                              }}
                              className="py-2 rounded-none hover:!bg-accent text-selectedValue hover:!text-accent-foreground hover:font-medium"
                            >
                              <div
                                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-sm border ${field.value.includes(option.name) ? 'bg-primary text-primary-foreground' : 'opacity-50'}`}
                              >
                                {field.value.includes(option.name) && (
                                  <Check className="h-5 w-5" />
                                )}
                              </div>
                              <span>{option.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="!m-[1px] absolute">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}

export default MultiSelectComboboxField
