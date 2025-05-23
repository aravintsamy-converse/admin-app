import React from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@/components/client/icons/PlusIcon'
import { AddButtonProps } from '@/Types/components/client/Icons'

const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  label = 'Add',
  className,
}) => {
  return (
    <>
      <Button
        variant="default"
        type="button"
        onClick={onClick}
        className={`rounded-sm bg-primary hover:bg-background text-primary-foreground font-normal border border-primary group flex items-center gap-1 shadow-[2px_2px_5px_0px_#1D57C747] ${className}`}
      >
        <PlusIcon />
        <span className="group-hover:text-primary text-primary-foreground text-sm 3xl:text-[15px] group-hover:font-semibold">
          {label}
        </span>
      </Button>
    </>
  )
}

export default AddButton
