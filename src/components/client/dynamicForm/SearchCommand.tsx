import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '@/components/ui/command'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  navItems: NavItem[]
  navSettings: any
}

export type NavItem = {
  title: string
  url?: string
  icon?: string
  isActive?: boolean
  items?: NavItem[]
}

export type SearchItem = {
  label: string
  url?: string
}
export function flattenNavItems(
  items: NavItem[],
  parentPath = ''
): SearchItem[] {
  let result: SearchItem[] = []

  for (const item of items) {
    const currentPath = parentPath
      ? `${parentPath} > ${item.title}`
      : item.title

    const hasChildren = item.items && item.items.length > 0
    if (item.url && !hasChildren) {
      result.push({ label: currentPath, url: item.url })
    }

    if (hasChildren) {
      result = result.concat(flattenNavItems(item.items!, currentPath))
    }
  }

  return result
}

function highlightMatch(text: string, query: string) {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === query.toLowerCase()
    return isMatch ? (
      <strong key={index} className="font-bold">
        {part}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    )
  })
}

export function SearchCommand({
  open,
  onOpenChange,
  navItems,
  navSettings,
}: SearchCommandProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const searchItems = useMemo(() => flattenNavItems(navItems), [navItems])
  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return searchItems.filter((item) =>
      item.label.toLowerCase().includes(query)
    )
  }, [searchTerm, searchItems])
  if (!open) return null

  return (
    <div
      className={cn(
        'absolute inset-0 flex justify-center z-[999] w-full  p-4 pt-[75px] ',
        'bg-black/15 '
      )}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white bg-black/15 w-full  md:w-[600px] h-fit rounded-sm "
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Command>
          <CommandInput
            className="md:w-[600px] pl-[10px] h-[35px] md:h-[50px] font-normal text-[#42526E] rounded-sm"
            placeholder="Search screen names..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          {searchTerm.length >= 1 && (
            <CommandList className=" p-2  pl-[38px] hover:bg-transparent  data-[selected=true]:bg-transparent ">
              {filteredItems.length === 0 && (
                <CommandEmpty className="text-[#42526E] p-2 flex justify-center">
                  No results found.
                </CommandEmpty>
              )}
              {searchItems.map((item, index) => (
                <CommandItem
                  style={
                    {
                      '--fw': navSettings.textWeight,
                      fontSize: '0.9375rem',
                    } as React.CSSProperties
                  }
                  className="text-[#42526E]  hover:text-primary hover:bg-transparent data-[selected=true]:bg-transparent cursor-pointer"
                  key={index}
                  onSelect={() => {
                    if (item.url) window.location.href = item.url
                    onOpenChange(false)
                    setSearchTerm('')
                  }}
                >
                  <span>{highlightMatch(item.label, searchTerm)}</span>
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  )
}
