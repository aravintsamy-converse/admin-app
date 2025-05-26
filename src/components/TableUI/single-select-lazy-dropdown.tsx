"use client"

import * as React from "react"
import { useDebounce } from "use-debounce"
import { fetchDropDownData } from "@/Services/Pages/User/TableServices"
import { SingleSelectLazyDropdownUI } from "./single-select-lazy-dropdown-ui"

interface Option {
  value: string
  label: string
}

interface SingleSelectProps {
  placeholder?: string
  className?: string
  onChange: (value: Option | null) => void
  value: Option | null
}

export function SingleSelectLazyDropdown({
  placeholder = "Select an option",
  className,
  onChange,
  value = null,
}: SingleSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<Option[]>([])
  const [loading, setLoading] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [debouncedQuery] = useDebounce(query, 700)
  const [page, setPage] = React.useState(1)
  const [totalRecords, setTotalRecords] = React.useState(0)
  const commandListRef = React.useRef<HTMLDivElement>(null)

  const recordLimit = 10
  const hasMore = page < Math.ceil(totalRecords / recordLimit)

  const fetchOptions = React.useCallback(
    async (searchQuery: string, pageNum: number, append = false) => {
      try {
        setLoading(true)
        const params: any = {
          search: searchQuery,
          page: pageNum,
          record_limit: recordLimit,
        }
        const queryString = new URLSearchParams(params).toString()
        const response = await fetchDropDownData(queryString)

        const newOptions = response.options.map((item: { value: string; label: string }) => ({
          value: item.value,
          label: item.label,
        }))

        setOptions((prev) => {
          const existing = new Set(prev.map((o) => o.value))
          const unique = newOptions.filter((opt: Option) => !existing.has(opt.value))
          return append ? [...prev, ...unique] : newOptions
        })

        if (pageNum === 1) {
          setTotalRecords(response.total_records)
        }
      } catch (err) {
        console.error("Dropdown fetch error:", err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  React.useEffect(() => {
    if (open) {
      setQuery("")
      setPage(1)
      fetchOptions("", 1, false)
    }
  }, [open, fetchOptions])

  React.useEffect(() => {
    setPage(1)
    fetchOptions(debouncedQuery, 1, false)
  }, [debouncedQuery, fetchOptions])

  React.useEffect(() => {
    if (!open || !commandListRef.current) return

    const el = commandListRef.current
    const handleScroll = () => {
      if (loading || !hasMore) return
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight - scrollTop - clientHeight < 50) {
        const nextPage = page + 1
        setPage(nextPage)
        fetchOptions(debouncedQuery, nextPage, true)
      }
    }
    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [open, page, loading, hasMore, debouncedQuery, fetchOptions])

  const handleSearchChange = (val: string) => setQuery(val)

  const handleSelect = (option: Option) => {
    onChange(value?.value === option.value ? null : option)
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <SingleSelectLazyDropdownUI
      placeholder={placeholder}
      className={className}
      value={value}
      options={options}
      loading={loading}
      commandListRef={commandListRef}
      onSearchChange={handleSearchChange}
      onSelect={handleSelect}
      onRemove={handleRemove}
      open={open}
      onOpenChange={setOpen}
    />
  )
}