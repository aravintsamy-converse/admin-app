"use client"

import { useState } from "react"
import { MultiSelectLazyDropdown } from "../TableUI/multi-select-dropdown"
import { SingleSelectLazyDropdown } from "../TableUI/single-select-lazy-dropdown"

interface Option {
  value: string
  label: string
}

export default function Home() {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  console.log("🚀 ~ Home ~ selectedOptions:", selectedOptions)
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)

  return (
    <div className="flex  w-full flex-col justify-center   p-4">
      <h1 className="text-2xl font-bold mb-4">Multi-Select Dropdown Example</h1>
      <p className="mb-4">Select multiple options from the dropdown below:</p>
      <div className="w-full grid grid-cols-4 gap-4">
      <MultiSelectLazyDropdown placeholder="Select options" value={selectedOptions} onChange={setSelectedOptions} />
      {/* <SingleSelectLazyDropdown placeholder="Select option" value={selectedOption} onChange={setSelectedOption} /> */}
    </div>
    </div>
  )
}