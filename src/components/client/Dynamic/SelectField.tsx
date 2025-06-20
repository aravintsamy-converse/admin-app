'use client'
import { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { ChevronDown, Loader } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectFieldProps } from '@/Types/components/client/types'
const SelectField = <T extends FieldValues>({
  control,
  name,
  options,
  placeholder,
}: SelectFieldProps<T>) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl className="">
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                }}
                value={field.value}
                open={open}
                onOpenChange={setOpen}
              >
                <SelectTrigger
                  data-testid="select-trigger"
                  className={`max-w-[508px]   pl-[14px] h-[35px]  text-selectedValue focus:outline-none  text-sm font-normal rounded-sm hover:border-primary shadow-none border  ${open ? 'border-primary' : 'border-border'}   hover:bg-background `}
                >
                  <SelectValue
                    data-testid="select-value"
                    placeholder={placeholder || 'Select Option '}
                  />
                  <ChevronDown
                    className={`transition-transform duration-200 h-4 w-4 text-selectedValue ${
                      open ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </SelectTrigger>
                <SelectContent
                  data-testid="select-content"
                  className=" !shadow-custom border-none"
                >
                  {!options ? (
                    <div className="flex justify-center p-2">
                      <Loader data-testid="loader" className="animate-spin" />
                    </div>
                  ) : (
                    <div className="p-1  max-h-[224px] secondary-scrolls overflow-y-auto">
                      {options.map((option, index) => (
                        <SelectItem
                          data-testid={`select-item-${option.id}`}
                          key={`${option}-${index}`}
                          value={option.name}
                          className={`pl-10 py-2  !text-selectedValue rounded-none hover:!bg-accent  hover:!text-accent-foreground hover:font-medium
             data-[state=checked]:!bg-accent  data-[state=checked]:!text-accent-foreground`}
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="!m-[1px] absolute " />
          </FormItem>
        )}
      />
    </>
  )
}

export default SelectField
