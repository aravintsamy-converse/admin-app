'use client'
import { useState } from 'react'
import { FieldValues, Path } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { NumberDropDownProps } from '@/Types/components/client/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const NumberDropDown = <T extends FieldValues>({
  name,
  hidden,
  control,
  placeholder,
  options,
}: NumberDropDownProps<T>) => {
  const [open, setOpen] = useState(false)
  const [focusID, setFocusID] = useState(false)

  return (
    <>
      <div
        data-testid="number-dropdown-container"
        className={`${hidden ? 'hidden' : ''} flex items-end max-w-[508px] group relative  `}
      >
        <FormField
          control={control}
          name={`${name}.value` as Path<T>}
          render={({ field, fieldState }) => (
            <FormItem className=" !w-full  ">
              <FormControl className={`${hidden ? 'hidden' : ''}`}>
                <Input
                  type="text"
                  value={field.value ?? 1}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '')
                    field.onChange(numericValue ? parseInt(numericValue) : '')
                  }}
                  onFocus={() => setFocusID(true)}
                  onBlur={() => setFocusID(false)}
                  placeholder={placeholder}
                  className={`transition-transform group-hover:border-primary shadow-none group-hover:!border-r-0  ${focusID || open ? '!border-primary !border-r-0' : ''}   h-[35px] w-full text-selectedValue font-normal border border-border  !rounded-r-none  border-r-0 rounded-sm focus:!outline-none focus:!ring-0  focus-within:!ring-0 focus-within:!outline-none `}
                />
              </FormControl>
              <div className="h-[33px] w-[1px] absolute right-[104px] 2xl:right-[104px]  bottom-[1px] 3xl:right-[109px] bg-border"></div>
              <FormMessage className="!m-[1px] absolute">
                {fieldState.error?.message}
              </FormMessage>{' '}
            </FormItem>
          )}
        />

        {/* Dropdown Select Field */}
        <FormField
          control={control}
          name={`${name}.unit` as Path<T>}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || options[0]?.value}
                  open={open}
                  onOpenChange={(isOpen) => {
                    setOpen(isOpen)
                    setFocusID(isOpen)
                  }}
                >
                  <SelectTrigger
                    className={`group-hover:border-primary pl-0 flex  justify-around  ${focusID || open ? '!border-primary' : ''} max-w-[100px]  font-normal text-selectedValue  border-border border-l-0 rounded-l-none  focus:!outline-none  focus:!ring-0  focus-within:!ring-0 focus-within:!outline-none ,'flex h-[35px] mt-[2px] w-full rounded-sm border  hover:border-primary bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:font-light placeholder:opacity-95 focus-visible:outline-none focus:border-primary focus:border-[2px] focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'`}
                  >
                    <SelectValue />
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200  text-selectedValue ${open ? 'rotate-180' : 'rotate-0'}`}
                    />
                  </SelectTrigger>
                  <SelectContent className="!shadow-custom  min-w-[var(--radix-popover-trigger-width)] border-0 rounded-none ">
                    <div className="p-1 ">
                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="p-2 text-center mb-[2px]  rounded-none hover:!bg-accent  hover:!text-accent-foreground  hover:font-medium 
             data-[selected=true]:bg-popover  data-[selected=true]:text-selectedValue data-[state=checked]:!bg-accent  data-[state=checked]:!text-accent-foreground "
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
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

export default NumberDropDown
