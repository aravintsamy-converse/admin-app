'use client'
import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AccordionSectionProps } from '@/Types/components/client/types'

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  value,
  children,
  form,
  errorPath,
  defaultValue,
}) => {
  const [isOpen, setIsOpen] = useState<string | undefined>(undefined)
  useEffect(() => {
    const errors = form?.formState?.errors
    if (!errors) return

    const hasError = getNestedError(errors, errorPath)
    if (hasError) {
      setIsOpen(value)
    }
  }, [form?.formState?.errors, errorPath, value])
  return (
    <>
      <Accordion
        type="single"
        className="w-full h-full "
        value={isOpen}
        defaultValue={defaultValue}
        onValueChange={(val) => setIsOpen(val)}
        collapsible
      >
        <AccordionItem value={value} className="w-full border-none">
          <AccordionTrigger className="bg-accordionTriggerBg text-foreground rounded-md border  border-r-0 border-border justify-start gap-3 [&[data-state=open]>svg]:rotate-90 [&[data-state=open]]:rounded-b-none hover:no-underline pl-8 focus-visible:outline-primary focus-within:outline-primary ">
            <span className="font-semibold tracking-normal text-base ">
              {title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="bg-background p-10  pt-[30px] pb-[34px] rounded-b-md border border-t-0 grid  gap-4  ">
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default AccordionSection

function getNestedError(obj: any, path?: string): boolean {
  if (!path || !obj) return false

  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current = obj
  for (const key of keys) {
    if (current?.[key]) {
      current = current[key]
    } else {
      return false
    }
  }
  return true
}
