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
  onChange: (value: Option | null) => void
  value: Option | null
}

export function SingleSelectLazyDropdown({
  placeholder = "Select option",
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
  }, [open])

  React.useEffect(() => {
    setPage(1)
    fetchOptions(debouncedQuery, 1, false)
  }, [debouncedQuery, fetchOptions])

  // Scroll handler
  const handleScroll = React.useCallback(() => {
    if (!commandListRef.current || loading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = commandListRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50

    if (isNearBottom) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchOptions(debouncedQuery, nextPage, true)
    }
  }, [page, loading, hasMore, debouncedQuery, fetchOptions])

  // Attach scroll listener once dropdown is open and ref is available
  React.useEffect(() => {
    if (!open) return

    let observer: MutationObserver | null = null

    const attachScrollListener = () => {
      const el = commandListRef.current
      if (el) {
        el.removeEventListener("scroll", handleScroll) // Clean before re-adding
        el.addEventListener("scroll", handleScroll)
        return true
      }
      return false
    }

    // Try attaching immediately if the ref is already available
    const isAttached = attachScrollListener()

    // If not available yet, observe the DOM
    if (!isAttached) {
      observer = new MutationObserver(() => {
        if (attachScrollListener() && observer) {
          observer.disconnect()
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      if (observer) observer.disconnect()
      const el = commandListRef.current
      if (el) {
        el.removeEventListener("scroll", handleScroll)
      }
    }
  }, [open, handleScroll])

  const handleSearchChange = (val: string) => setQuery(val)

  const handleSelect = (option: Option) => {
    onChange(option)
  }


  return (
    <SingleSelectLazyDropdownUI
      placeholder={placeholder}
      value={value}
      options={options}
      loading={loading}
      commandListRef={commandListRef}
      onSearchChange={handleSearchChange}
      onSelect={handleSelect}
      open={open}
      onOpenChange={setOpen}
    />
  )
}