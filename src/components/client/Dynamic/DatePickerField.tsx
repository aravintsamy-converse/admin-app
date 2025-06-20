'use client'
import * as React from 'react'
import { FieldValues } from 'react-hook-form'
import {
  addDays,
  format,
  isBefore,
  setMonth,
  setYear,
  startOfMonth,
  startOfToday,
} from 'date-fns'
import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  CalendarNavLeft,
  CalendarNavRight,
} from '@/components/client/icons/CalendarNavIcon'
import { DatePickerFieldProps } from '@/Types/components/client/types'
import { cn } from '@/lib/utils'
import { monthNames } from '@/mockData/Calender'
import { CalendarIcon } from '../icons/dynamicForm/AllDynamicFormIcons'

export const DatePickerField = <T extends FieldValues>({
  control,
  name,
  placeholder,
  description,
  hidden,
  disabledDate = (date) => date <= new Date(),
}: DatePickerFieldProps<T>) => {
  const currentYear = new Date().getFullYear()

  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState<'day' | 'open'>('day')
  const [yearOffset, setYearOffset] = React.useState(0)
  const [selectedYear, setSelectedYear] = React.useState(currentYear)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [showYearSelection, setShowYearSelection] = React.useState(false)

  const startYear = Math.max(currentYear + yearOffset, currentYear)
  const years = Array.from({ length: 12 }, (_, i) => startYear + i)

  React.useEffect(() => {
    if (!open) {
      setMode('day')
    }
  }, [open])

  return (
    <>
      <div
        data-testid="conditional-div"
        className={`${hidden ? 'hidden' : ''}`}
      >
        <FormField
          control={control}
          name={name}
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col ">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      data-testid="date-picker-trigger"
                      className={cn(
                        'text-selectedValue  outline-none cursor-pointer  max-w-[508px]  pl-[14px]  h-[35px]  border-border   justify-between rounded-sm   shadow-none transition-all duration-200 hover:border-primary hover:text-selectedValue  font-normal text-sm border  hover:bg-background',
                        'flex h-[35px] mt-[2px] w-full  border  hover:border-primary bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:font-light placeholder:opacity-95 focus-visible:outline-none focus:border-primary focus:border-[2px] focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        !field.value && 'text-muted-foreground ',
                        !!open && 'border-primary'
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), 'dd/MM/yyyy')
                      ) : (
                        <span className="hover:text-muted-foreground font-light">
                          {placeholder}
                        </span>
                      )}

                      {/* CalendarIcon   */}
                      <span>
                        <CalendarIcon />
                      </span>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  data-testid="date-picker-content "
                  data-view={mode}
                  className="w-full transition-all border-none !shadow-custom rounded-xl p-0 "
                  align="end"
                >
                  {mode === 'day' && (
                    <Calendar
                      weekStartsOn={1}
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date)
                          setOpen(false)
                        }
                      }}
                      disabled={disabledDate}
                      fromDate={startOfToday()}
                      month={currentMonth}
                      onMonthChange={(newMonth) => {
                        setCurrentMonth(newMonth)
                      }}
                      showOutsideDays
                      initialFocus
                      className="pt-2 h-auto w-[245px]  "
                      classNames={{
                        day_outside: 'invisible pointer-events-none',
                        nav_button:
                          'h-6 w-6 flex items-center justify-center bg-transparent p-0 opacity-50 hover:opacity-100 outline-none hover:shadow-custom rounded-sm hover:bg-background',
                        caption_label:
                          'text-primary font-bold text-[0.9375rem] cursor-pointer ',
                        cell: 'flex h-[22px] w-[32px] ',
                        head_row: ' flex justify-around',
                        head_cell:
                          'text-primary rounded-md w-8 font-medium text-[0.875rem]  ',
                        day: cn(
                          buttonVariants({ variant: 'ghost' }),
                          'h-[28px] w-[26px] p-0  text-muted-foreground hover:shadow-customhover font-normal text-[0.875rem] rounded-sm hover:bg-background   '
                        ),
                      }}
                      formatters={{
                        formatCaption: (date) => (
                          <div className="flex gap-1 items-center">
                            <button
                              type="button"
                              data-testid="date-picker-caption"
                              onClick={() => {
                                setMode('open')
                                setSelectedYear(date.getFullYear())
                              }}
                              className="font-bold text-primary text-[0.9375rem]"
                            >
                              {' '}
                              <span className="font-bold text-primary text-[0.9375rem]">
                                {format(date, 'MMM')}
                              </span>
                              ,{format(date, 'yyyy')}
                            </button>
                          </div>
                        ),
                      }}
                      components={{
                        IconLeft: CalendarNavLeft,
                        IconRight: CalendarNavRight,
                      }}
                    />
                  )}

                  {mode === 'open' && (
                    <>
                      <div className="w-[230px] h-[230px] transition-all border-none !shadow-custom rounded-xl p-4 pt-4  pb-6">
                        <div className="flex items-center justify-between w-full !mb-4 cursor-pointer">
                          <Button
                            data-testid="prev-year-button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (showYearSelection) {
                                setYearOffset((prev) => prev - 12)
                              } else {
                                if (selectedYear > currentYear) {
                                  setSelectedYear((prev) => prev - 1)
                                }
                              }
                            }}
                            disabled={
                              !showYearSelection && selectedYear <= currentYear
                            }
                            className="h-6 w-6 pl-[9px] p-2 pt-3 flex items-center justify-center hover:shadow-custom rounded-sm hover:bg-backgroundd"
                          >
                            <CalendarNavLeft className="!h-5 !w-5 !flex !items-center !justify-center mb-1" />
                          </Button>

                          <span
                            data-testid="date-year-caption"
                            className="text-sm font-semibold text-primary cursor-pointer "
                            onClick={() =>
                              setShowYearSelection((prev) => !prev)
                            }
                          >
                            {selectedYear}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            data-testid="next-year-button"
                            onClick={() => {
                              if (showYearSelection) {
                                setYearOffset((prev) => prev + 12)
                              } else {
                                setSelectedYear((prev) => prev + 1)
                              }
                            }}
                            className="h-6 w-6 pl-[9px] p-2 pt-3 flex items-center justify-center hover:shadow-custom rounded-sm hover:bg-backgroundd"
                          >
                            <CalendarNavRight className="!h-5 !w-5 !flex !items-center !justify-center mb-1" />
                          </Button>
                        </div>

                        {showYearSelection ? (
                          <div className="grid grid-cols-3 gap-2 mb-1 ">
                            {years.map((year) => (
                              <Button
                                key={year}
                                name={String(year)}
                                variant={
                                  selectedYear === year ? 'default' : 'outline'
                                }
                                className={cn(
                                  'text-sm w-[55px] h-[30px] rounded-sm text-selectedValue font-normal border-none hover:shadow-customhover shadow-none hover:bg-background hover:scale-100 transition-all duration-300 hover:text-accent-foreground hover:font-medium ',
                                  selectedYear === year &&
                                    '!bg-primary !text-primary-foreground !font-medium transition-all duration-200 shadow-[2px_2px_5px_0px_#00000047]'
                                )}
                                onClick={() => {
                                  setSelectedYear(year)
                                  setShowYearSelection((prev) => !prev)
                                }}
                              >
                                {year}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2 gap-y-4">
                            {monthNames.map((month, index) => {
                              const date = setMonth(
                                setYear(addDays(new Date(), 1), selectedYear),
                                index
                              )
                              const isSelected =
                                field.value &&
                                field.value.getFullYear() === selectedYear &&
                                field.value.getMonth() === index
                              const isPastMonth = isBefore(
                                startOfMonth(date),
                                startOfMonth(new Date())
                              )

                              return (
                                <Button
                                  key={index}
                                  variant="outline"
                                  name={month.slice(0, 3)}
                                  className={cn(
                                    'text-sm w-[55px] h-[25px] rounded-sm text-selectedValue font-normal border-none hover:shadow-customhover shadow-none hover:bg-background hover:scale-100 transition-all duration-500 hover:text-accent-foreground hover:font-medium',
                                    isSelected &&
                                      '!bg-primary !text-primary-foreground !font-medium !border-none shadow-[2px_2px_5px_0px_#00000047]'
                                  )}
                                  onClick={() => {
                                    if (!isPastMonth) {
                                      setCurrentMonth(date)
                                      field.onChange(date)
                                      setMode('day')
                                    }
                                  }}
                                  disabled={isPastMonth}
                                >
                                  {month.slice(0, 3)}
                                </Button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </PopoverContent>
              </Popover>
              {!field.value && !fieldState.error?.message && (
                <FormDescription className="!m-[1px] ">
                  {description}
                </FormDescription>
              )}
              <FormMessage className="!m-[1px] "></FormMessage>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
