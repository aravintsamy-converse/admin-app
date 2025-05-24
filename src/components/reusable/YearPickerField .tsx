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
import { YearPickerFieldProps } from '@/Types/components/external/YearPickerFieldTypes'
import {
  LeftArrowIcon,
  RightArrowIcon,
} from '@/components/client/icons/ArrowIcon'

const YearPickerField: React.FC<YearPickerFieldProps> = ({
  control,
  name,
  label,
  span,
  range = 12,
}) => {
  const currentYear = new Date().getFullYear()
  const [open, setOpen] = useState(false)
  const [offset, setOffset] = useState(0)

  const startYear = currentYear + offset
  const years = Array.from({ length: range }, (_, i) => startYear + i)

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          return (
            <FormItem>
              <FormLabel className="font-normal opacity-95 text-foreground text-[15px]">
                {label} <span className="opacity-55">{span}</span>
              </FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      data-testid="year-picker-trigger"
                      variant="outline"
                      className="3xl:w-[240px] lg:min-w-[200px]  w-full h-[35px]  justify-between rounded-sm text-left text-selectedValue border-border hover:bg-background hover:text-foreground "
                    >
                      {field.value ? (
                        <span className="text-selectedValue font-normal">
                          {field.value}
                        </span>
                      ) : (
                        <span className="font-light text-muted-foreground">
                          Select Year
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
                    className="p-4  pt-3 max-w-[var(--radix-popover-trigger-width)] border-none !shadow-custom rounded-xl"
                    align="end"
                  >
                    <div className="flex items-center justify-between relative mb-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setOffset((prev) => Math.max(0, prev - range))
                        }
                        className="h-6 w-6 p-2 pt-3  flex items-center justify-center hover:shadow-custom rounded-sm hover:bg-background"
                        disabled={offset === 0}
                      >
                        <span>
                          <LeftArrowIcon />
                        </span>
                      </Button>

                      <span className="text-sm font-semibold text-primary">
                        {startYear}-{startYear + range - 1}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOffset((prev) => prev + range)}
                        className="h-6 w-6 p-2 pt-3  flex items-center justify-center hover:shadow-custom rounded-sm hover:bg-background "
                      >
                        <span>
                          <RightArrowIcon />
                        </span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 gap-y-[10px]">
                      {years.map((year) => (
                        <Button
                          data-testid={`year-option-${year}`}
                          key={year}
                          variant={field.value === year ? 'default' : 'outline'}
                          className={`text-sm w-[55px] h-[30px] rounded-sm text-selectedValue font-normal border-none hover:shadow-customhover shadow-none hover:bg-background hover:scale-100 transition-all duration-300 hover:text-accent-foreground hover:font-medium ${
                            field.value === year
                              ? '!bg-primary !text-primary-foreground !font-medium transition-all duration-200 shadow-[2px_2px_5px_0px_#00000047]'
                              : ''
                          }`}
                          onClick={() => {
                            field.onChange(
                              field.value === year ? undefined : year
                            )
                            setTimeout(() => {
                              setOpen(false)
                            }, 150)
                          }}
                        >
                          {year}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="!m-[1px] 3xl:absolute">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )
        }}
      />
    </>
  )
}

export default YearPickerField
