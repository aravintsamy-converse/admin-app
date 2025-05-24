"use client"

import { useState } from "react"
import { MultiSelectDropdown } from "../TableUI/multi-select-dropdown"

interface Option {
  value: string
  label: string
}

export default function Home() {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])

  return (
    <div className="w-[30%] space-y-4">
      <MultiSelectDropdown placeholder="Select options" value={selectedOptions} onChange={setSelectedOptions} />
    </div>
  )
}