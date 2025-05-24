'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { MonthPickerFieldProps } from '@/Types/components/external/MonthPickerTypes'
import { monthNames } from '@/mockData/Calender'

const MonthPickerField: React.FC<MonthPickerFieldProps> = ({
  control,
  name,
  label,
  span,
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          return (
            <>
              <FormItem>
                <FormLabel className="font-normal opacity-95 text-foreground text-[15px]">
                  {label} <span className="opacity-55">{span}</span>
                </FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="3xl:w-[240px] lg:min-w-[200px]  w-full h-[35px] !mt-[6.1px] justify-between rounded-sm text-left text-selectedValue border-border hover:bg-background hover:text-foreground"
                      >
                        {field.value ? (
                          <span className="text-selectedValue font-normal">
                            {field.value}
                          </span>
                        ) : (
                          <span className="font-light text-muted-foreground">
                            Select Month
                          </span>
                        )}

                        <ChevronDown
                          className={`transition-transform duration-200 text-muted-foreground ${
                            open ? 'rotate-180' : 'rotate-0'
                          }`}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-4 pt-3 3xl:pl-4 lg:pl-1 max-w-[var(--radix-popover-trigger-width)] transition-all border-none !shadow-custom rounded-xl"
                      align="end"
                    >
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-sm  font-semibold text-primary">
                          Jan-Dec
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 gap-y-4">
                        {monthNames.map((month) => (
                          <Button
                            key={month}
                            variant={
                              field.value === month ? 'default' : 'outline'
                            }
                            className={`text-sm w-[55px] h-[25px] rounded-sm text-selectedValue font-normal border-none hover:shadow-customhover shadow-none hover:bg-background hover:scale-100 transition-all duration-500 hover:text-accent-foreground hover:font-medium ${
                              field.value === month
                                ? '!bg-primary !text-primary-foreground !font-medium transition-all duration-200 shadow-[2px_2px_5px_0px_#00000047]'
                                : ''
                            }`}
                            onClick={() => {
                              field.onChange(field.value === month ? '' : month)
                              setTimeout(() => {
                                setOpen(false)
                              }, 100)
                            }}
                          >
                            {month.slice(0, 3)}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage className="!m-[1px] absolute">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            </>
          )
        }}
      />
    </>
  )
}

export default MonthPickerField
