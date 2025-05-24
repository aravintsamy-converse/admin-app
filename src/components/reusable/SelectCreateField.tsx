'use client'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
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
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import CloseIcon from '@/components/client/icons/CloseIcon'
import TickIcon from '@/components/client/icons/TickIcon'
import { ChevronDown, Loader } from 'lucide-react'
import {
  createCompetencyField,
  fetchCompetencyOptions,
  fetchEducationTypesByParent,
} from '@/services/SelectCreateField'
import { SelectCreateFieldProps } from '@/Types/components/client/types'
import { toast } from 'react-toastify'
import { AddIcon } from '@/components/client/icons/AddIcon'

const SelectCreateField = ({
  name,
  span,
  label,
  fetchOptions,
  fetchOptionsUrl,
  field,
  parent_id,
  disabled,
  setParentIds,
  fetchEducationDetails,
  index,
  resetNameOfQualification,
}: SelectCreateFieldProps) => {
  const { control, setValue } = useFormContext()
  const [titles, setTitles] = useState<{ id: number; name: string }[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newJobTitle, setNewJobTitle] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (fetchOptions) {
      setTitles(fetchOptions || [])
      setLoading(false)
    }
  }, [fetchOptions])

  const handleAddJobTitle = () => {
    const trimmedTitle = newJobTitle.trim()

    if (
      trimmedTitle &&
      Array.isArray(titles) &&
      !titles.some((data) => data.name === trimmedTitle) &&
      !titles.some(
        (data) =>
          data.name ===
          trimmedTitle.charAt(0).toUpperCase() +
            trimmedTitle.slice(1).toLowerCase()
      )
    ) {
      handleCreateFiled(trimmedTitle)
    }
    setIsCreating(false)
    setNewJobTitle('')
  }
  const modifyArrayValues = (array: { name: string; id: number }[]) => {
    return array.map((values: { name: string; id: number }) => {
      if (values) {
        return {
          id: values.id,
          name:
            (values?.name).charAt(0).toUpperCase() +
            (values?.name).slice(1).toLowerCase(),
        }
      }
    })
  }

  const handleCreateFiled = async (value: string) => {
    if (!field) {
      toast.error('Field is required')
      return
    }

    const payload = {
      name: value,
      field,
      parent: parent_id || 0,
    }

    try {
      const result = await createCompetencyField(payload)

      if (result.details) {
        toast.error(result.details.detail)
        return
      }
      if (fetchOptionsUrl) {
        setLoading(true)
        try {
          const data = await fetchCompetencyOptions(fetchOptionsUrl)

          if (data.detail) {
            toast.error(data.detail)
          } else {
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                data[key] = modifyArrayValues(data[key])
              }
            }

            setTitles(Array.isArray(data[field]) ? data[field] : [])
            setValue(name, result.name)

            if (field === 'education_level') {
              fetchEducationDetails?.(result.id)
              setParentIds?.({ name: result.name, type: result.id })
              resetNameOfQualification?.(index as number)
            }
          }
        } catch (error) {
          setError('Failed to load options.')
          toast.error('Failed to load job titles.')
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
      if (parent_id) {
        setLoading(true)
        try {
          const data = await fetchEducationTypesByParent(parent_id)

          if (data.detail) {
            toast.error(data.detail)
          } else {
            Object.entries(data).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                data[key] = modifyArrayValues(value)
              }
            })

            setTitles(data[field])
            setValue(name, result.name)
          }
        } catch (error) {
          setError('Failed to load options.')
          toast.error('Failed to load education types.')
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
    } catch (error) {
      toast.error('Something went wrong.')
      console.error(error)
    }
  }
  return (
    <>
      <div className="relative h-max  lg:w-full ">
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="font-normal  text-foreground text-[15px]">
                {label}
                <span className="opacity-55">{span}</span>{' '}
              </FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      data-testid="select-create-field-trigger"
                      variant="outline"
                      className={`${disabled ? '!cursor-not-allowed ' : ''} text-selectedValue w-full  outline-none  3xl:w-[508px] !mt-[6px] pl-[14px]  h-[35px]     justify-between rounded-sm  shadow-none transition-all duration-200 hover:border-primary    font-normal text-sm border ${open ? 'border-primary' : 'border-border'} hover:bg-background`}
                      disabled={disabled}
                    >
                      {field.value ? (
                        <span className="text-selectedValue ">
                          {field.value.charAt(0).toUpperCase() +
                            field.value.slice(1).toLowerCase()}
                        </span>
                      ) : (
                        <span className="font-light text-muted-foreground">
                          Select Option
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
 rounded-sm border-none"
                  >
                    <Command defaultValue={field.value}>
                      <div className="pl-[3px]">
                        <CommandInput
                          className="placeholder:text-sm placeholder:font-light pl-[14px] pt-3 h-[39px]"
                          placeholder="Search by Job"
                        />
                      </div>
                      {loading ? (
                        <div className="flex justify-center p-2">
                          <Loader
                            data-testid="loader"
                            className="animate-spin"
                          />
                        </div>
                      ) : error ? (
                        <div className="text-red-500 text-center p-2 text-sm">
                          {error}
                        </div>
                      ) : (
                        <CommandList className="overflow-auto secondary-scrolls  border-none h-[111px]  px-[5px]  py-0  ">
                          {Array.isArray(titles) && titles.length > 0 ? (
                            titles.map((type) => (
                              <CommandItem
                                className={`pl-[50px] pt-1 mt-[1px] cursor-pointer rounded-none text-selectedValue text-sm py-2 font-normal hover:!bg-accent hover:!text-accent-foreground hover:font-medium  
                          data-[selected=true]:!bg-accent data-[selected=true]:!text-accent-foreground  ${field.value && type.name && field.value.toLowerCase() === type.name.toLowerCase() ? '!bg-accent !text-accent-foreground' : ''}`}
                                key={type.id}
                                onSelect={() => {
                                  setValue(name, type.name, {
                                    shouldValidate: true,
                                  })
                                  if (
                                    name.includes(
                                      `educationDetails.${index}.typeOfQualification`
                                    )
                                  ) {
                                    setParentIds?.({
                                      name: name,
                                      type: type.id,
                                    })

                                    fetchEducationDetails?.(type.id)
                                    resetNameOfQualification?.(index as number)
                                  }
                                  setOpen(false)
                                }}
                              >
                                {type.name}
                              </CommandItem>
                            ))
                          ) : (
                            <div className="text-muted-foreground text-center p-2 text-sm">
                              No options available
                            </div>
                          )}
                        </CommandList>
                      )}
                      <div className=" flex w-full justify-center items-center   ">
                        <div className="h-[1px] w-[97%] bg-border  opacity-40 "></div>
                      </div>
                      {!isCreating ? (
                        <div className="p-1 m-0  shadow-none">
                          <Button
                            variant="outline"
                            className="w-full group flex justify-start items-center  bg-popover hover:bg-popover text-primary hover:text-primary hover:font-semibold gap-0 shadow-none  pb-0   border-none outline-none text-sm  pt-0  "
                            onClick={() => setIsCreating(true)}
                          >
                            <span className="text-sm  hover:font-semibold pl-[33px] pr-[2px] pt-[3px] group ">
                              <AddIcon />
                            </span>
                            Create New
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-[1fr_auto_auto] gap-2 p-2">
                          <Input
                            type="text"
                            className={`border hover:border-primary ${newJobTitle.length > 0 ? ' border-primary' : ' '} focus:border-primary focus:!outline-none  shadow-none`}
                            value={newJobTitle}
                            onChange={(e) => setNewJobTitle(e.target.value)}
                          />

                          <Button
                            variant="default"
                            className="px-1 min-w-[66px] text-[15px] flex justify-end bg-transparent hover:bg-background gap-1 font-medium hover:font-semibold text-accent-foreground shadow-none  "
                            onClick={handleAddJobTitle}
                            disabled={
                              !newJobTitle.trim() ||
                              titles.some(
                                (data) =>
                                  data.name.trim().toLowerCase() ===
                                  newJobTitle.trim().toLowerCase()
                              )
                            }
                          >
                            <span className="text-center group-hover:text-[#143D8C] transition-colors duration-200">
                              <TickIcon />
                            </span>
                            Save
                          </Button>
                          <Button
                            variant="default"
                            className="px-1 min-w-[80px] text-[15px] bg-transparent hover:text-accent-foreground text-[#889ABC] hover:bg-background gap-1 font-medium hover:font-semibold  shadow-none  "
                            onClick={() => setIsCreating(false)}
                          >
                            <span className="text-center">
                              <CloseIcon className=" hover:text-accent-foreground" />
                            </span>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="!m-[1px] 3xl:absolute">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}

export default SelectCreateField
