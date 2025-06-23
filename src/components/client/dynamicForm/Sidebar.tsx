'use client'

import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import MenuIcon, {
  AdminIon,
  ChartBarIcon,
  DocumentIcon,
  GierIcon,
  GlobalIcon,
  GridIcons,
  HandIcon,
  LayoutGridIcon,
  PackageApprovedIcon,
  SettingsIcon,
  Search,
  Teams,
  Heart,
  Project,
  UserIcon,
  NavTrigger,
  NavItem,
} from '../icons/dynamic/all-dynamic-form-icons'
import Image from 'next/image'
import { SearchCommand } from './SearchCommand'

const iconMap: Record<string, React.FC<any>> = {
  MenuIcon,
  LayoutGridIcon,
  UserIcon,
  ChartBarIcon,
  GridIcons,
  DocumentIcon,
  PackageApprovedIcon,
  GierIcon,
  Heart,
  Project,
  SettingsIcon,
  Search,
  Teams,
  HandIcon,
  AdminIon,
  GlobalIcon,
  NavItem,
}

type NavItem = {
  title: string
  icon?: string
  isActive?: boolean
  url?: string
  items?: NavItem[]
}

export function AppSidebar({
  items,
  navSettings,
  toggle,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navSettings: any
  toggle: any
  items: NavItem[]
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetItem, setSheetItem] = useState<NavItem | null>(null)
  const [activePath, setActivePath] = useState<string[]>([])
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState<boolean>(false)
  const { toggleSidebar } = useSidebar()
  function openSheetForItem(item: NavItem) {
    if (item.title === 'Search') {
      setIsSearchDialogOpen(true)
    } else {
      setSheetItem(item)
      setIsSearchDialogOpen(false)
      setIsSheetOpen(true)
    }
  }

  const isPathActive = (path: string[]) => {
    return (
      activePath.length >= path.length &&
      path.every((value, i) => activePath[i] === value)
    )
  }

  const handleSelect = (path: string[]) => {
    setActivePath(path)
  }

  function isPathOrDescendantActive(
    itemPath: string[],
    activePath: string[]
  ): boolean {
    if (activePath.length < itemPath.length) return false
    for (let i = 0; i < itemPath.length; i++) {
      if (itemPath[i] !== activePath[i]) return false
    }
    return true
  }
  const [currentActivePath, setCurrentActivePath] = React.useState<string[]>([])

  function renderSheetSidebar(
    items: NavItem[],
    level = 0,
    currentPath: string[] = []
  ): React.ReactNode {
    return (
      <ul
        style={{ paddingLeft: `${level * 15}px` }}
        className={`flex flex-col gap-y-[2px] ${level > 0 ? 'pl-4' : ''}`}
      >
        {items.map((item) => {
          const hasChildren = item.items && item.items.length > 0
          const newPath = [...currentPath, item.title]
          const isActive = isPathActive(newPath)
          const IconComp = item.icon ? iconMap[item.icon] : null

          if (hasChildren) {
            return (
              <Collapsible key={item.title} defaultOpen={item.isActive}>
                <CollapsibleTrigger asChild>
                  <div
                    id={item.title}
                    className={` flex items-center  p-1 rounded  cursor-pointer group  ${isActive
                      ? 'text-primary font-semibold hover:bg-transparent'
                      : 'hover:text-primary hover:bg-transparent '
                      }`}
                    onClick={() => handleSelect(newPath)}
                  >
                    {IconComp && <IconComp width={18} height={18} />}
                    <span
                      style={
                        {
                          '--text-color': isActive
                            ? 'hsl(var(--primary))'
                            : navSettings.textColor,
                          '--fw': navSettings.textWeight,
                          fontSize: navSettings.textSize,
                        } as React.CSSProperties
                      }
                      className="text-[var(--text-color)] group-hover:text-primary group-hover:font-medium hover:text-primary hover:font-medium hover:bg-transparent"
                    >
                      {item.title}
                    </span>
                    <ChevronRight
                      className={`ml-auto  w-[14px] h-4 transition-transform duration-200  group-hover:text-primary group-hover:font-medium   group-data-[state=open]:-rotate-90  group-data-[state=closed]:rotate-90 ${isActive ? 'text-[hsl(var(--primary))] ' : 'text-[#42526E]'}`}
                    />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  {renderSheetSidebar(item.items!, level + 1, newPath)}
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <li
              key={item.title}
              onClick={() => {
                handleSelect(newPath)
                setCurrentActivePath(newPath)
                if (item.url) window.location.href = item.url
              }}
              className={`flex items-center gap-2 p-1 rounded cursor-pointer group ${isActive
                ? 'text-primary font-medium hover:bg-transparent'
                : 'hover:text-primary hover:font-medium  hover:bg-transparent'
                }`}
            >
              {IconComp && <IconComp width={18} height={18} />}
              <span
                style={
                  {
                    '--text-color': isActive
                      ? 'hsl(var(--primary))'
                      : navSettings.textColor,
                    '--fw': isActive ? 'semibold' : navSettings.textWeight,
                    fontSize: navSettings.textSize,
                  } as React.CSSProperties
                }
                className={`text-[var(--text-color)] !mt-0 mb-[1px] hover:text-primary group-hover:text-primary ${!hasChildren && level == 0 ? 'hover:text-primary hover:font-medium' : 'hover:pl-2 group-hover:pl-2 group-hover:font-medium  transition-all duration-700'} ${isActive ? 'font-semibold' : ''} `}
              >
                {item.title}
              </span>
            </li>
          )
        })}
      </ul>
    )
  }

  function renderNavItems(
    items: NavItem[],
    navSettings: any,
    level = 0,
    currentPath: string[] = []
  ): React.ReactNode {
    return items.map((item) => {
      const IconComp = item.icon ? iconMap[item.icon] : undefined
      const hasChildren = item.items && item.items.length > 0
      // const hasGrandChildren =
      //   hasChildren &&
      //   item.items!.some((child) => child.items && child.items.length > 0)
      const newPath = [...currentPath, item.title]
      const isActive = isPathOrDescendantActive(newPath, currentActivePath)
      const iconColor = isActive ? 'hsl(var(--primary))' : navSettings.textColor

      if (level === 0 && hasChildren && navSettings.isNavOpen) {
        return (
          <SidebarMenuItem key={`${item.title}-${level}`}>
            <SidebarMenuButton
              tooltip={navSettings.tooltip ? item.title : ''}
              className={`flex gap-[10px] items-center min-w-full cursor-pointer group ${isActive
                ? ' text-primary font-semibold hover:bg-transparent '
                : 'hover:text-primary  hover:font-medium hover:bg-transparent'
                }`}
              onClick={() => {
                openSheetForItem(item)
                handleSelect(newPath)
                setCurrentActivePath(newPath)
              }}
            >
              {IconComp &&
                React.createElement(IconComp, {
                  color: iconColor,
                })}
              <span
                style={
                  {
                    '--text-color': isActive
                      ? 'hsl(var(--primary))'
                      : navSettings.textColor,
                    '--fw': isActive ? 'semibold ' : navSettings.textWeight,
                    fontSize: navSettings.textSize,
                  } as React.CSSProperties
                }
                className="text-[var(--text-color)] hover:font-medium hover:bg-transparent group-hover/menu-item:text-primary group-hover/menu-item:font-medium hover:text-primary "
              >
                {item.title}
              </span>
              <ChevronRight
                className={`ml-auto  !w-[14px] !h-4 ${isActive ? '!text-[hsl(var(--primary))]' : '!text-[#42526E]'}`}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      }

      return (
        <Collapsible
          key={`${item.title}-${level}`}
          asChild
          defaultOpen={item.isActive}
          className="group/collapsible group"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={navSettings.tooltip ? item.title : ''}
                className={`flex gap-[10px] items-center min-w-full cursor-pointer ${isActive
                  ? ' text-primary font-semibold hover:bg-transparent '
                  : 'hover:text-primary  hover:font-medium hover:bg-transparent'
                  }`}
                onClick={() => {
                  if (hasChildren || item.title == 'Search') {
                    openSheetForItem(item)
                    handleSelect(newPath)
                    setCurrentActivePath(newPath)
                  }
                }}
              >
                {IconComp &&
                  React.createElement(IconComp, {
                    color: iconColor,
                  })}
                <span
                  style={
                    {
                      '--text-color': isActive
                        ? 'hsl(var(--primary))'
                        : navSettings.textColor,
                      '--fw': isActive ? 'medium ' : navSettings.textWeight,
                      fontSize: navSettings.textSize,
                    } as React.CSSProperties
                  }
                  className={`text-[var(--text-color)] hover:bg-transparent  group-hover/menu-item:text-primary `}
                >
                  {item.title}
                </span>
              </SidebarMenuButton>
            </CollapsibleTrigger>

            {hasChildren && (
              <CollapsibleContent>
                <SidebarMenuSub className="">
                  {renderSheetSidebar(item.items!, level + 1, newPath)}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      )
    })
  }

  function renderNavItemsSidebar(
    items: NavItem[],
    navSettings: any,
    level = 0,
    currentPath: string[] = []
  ): React.ReactNode {
    return items.map((item) => {
      const IconComp = item.icon ? iconMap[item.icon] : undefined
      const hasChildren = item.items && item.items.length > 0
      const newPath = [...currentPath, item.title]
      const isActive = isPathOrDescendantActive(newPath, currentActivePath)
      const iconColor = isActive ? 'hsl(var(--primary))' : navSettings.textColor

      return (
        <Collapsible
          key={`${item.title}-${level}`}
          asChild
          defaultOpen={isActive}
          className="group/collapsible [&[data-state=open]>button>svg:nth-child(2)]:-rotate-90 [&[data-state=closed]>button>svg:nth-child(2)]:rotate-90 group"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={navSettings.tooltip ? item.title : ''}
                className={`flex gap-[10px] items-center min-w-full cursor-pointer  group ${isActive
                  ? 'text-primary font-semibold hover:bg-transparent'
                  : 'hover:text-primary  hover:font-medium hover:bg-transparent   group-hover/menu-button:font-medium   group-hover/menu-button:text-primary'
                  }`}
                onClick={() => {
                  if (item.title === 'Search') {
                    openSheetForItem(item)
                    toggleSidebar()
                  }
                  if (hasChildren && !navSettings.isNavOpen) {
                    toggle()
                  }
                  handleSelect(newPath)
                  setCurrentActivePath(newPath)

                  if (item.url) window.location.href = item.url
                }}
              >
                {IconComp &&
                  React.createElement(IconComp, {
                    color: iconColor,
                  })}
                <span
                  style={
                    {
                      '--text-color': isActive
                        ? 'hsl(var(--primary))'
                        : navSettings.textColor,
                      '--fw': isActive ? 'medium' : navSettings.textWeight,
                      fontSize: navSettings.textSize,
                    } as React.CSSProperties
                  }
                  className={` ${navSettings.isNavOpen ? 'md:opacity-100  ' : ' opacity-100 md:opacity-0 '}  ${(!hasChildren && level == 2) || (!hasChildren && level == 3) ? 'text-sm w-full hover:pl-2 transition-all duration-700 ' : ''}`}
                >
                  {item.title}
                </span>
                {hasChildren && (
                  <ChevronRight
                    className={`ml-auto !w-[14px] !h-4 transition-transform group-data-[state=open]:-rotate-90  group-data-[state=closed]:rotate-90  `}
                  />
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>

            {hasChildren && (
              <CollapsibleContent>
                <SidebarMenuSub className="m-0 gap-0 ml-[16px] pl-1  ">
                  {renderNavItemsSidebar(
                    item.items!,
                    navSettings,
                    level + 1,
                    newPath
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      )
    })
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="relative"
        style={{
          width: navSettings.isNavOpen
            ? navSettings.width[1]
            : navSettings.width[0],
          pointerEvents: 'all',
        }}
        {...props}
      >
        <SidebarHeader
          className={`flex flex-row min-w-full justify-center items-center gap-0 h-[56px] mb-[18px]  pt-5 pl-3 pr-3 transition-all duration-500`}
        >
          {navSettings.isNavOpen && navSettings.header.image && (
            <Image
              src={navSettings.header.image}
              alt="Sidebar Logo"
              width={navSettings.header.width[1]}
              height={navSettings.header.width[0]}
            />
          )}
          {navSettings.isNavOpen &&
            navSettings.header.icons &&
            navSettings.header.icons.map((iconKey: string, index: number) =>
              iconMap[iconKey] ? (
                <span
                  key={index}
                  className="hover:text-primary pl-[22px] pr-[6px] hover:bg-transparent  transition-colors"
                >
                  {React.createElement(iconMap[iconKey])}
                </span>
              ) : null
            )}
          <SidebarTrigger className="hover:bg-transparent group/header">
            <span
              className={`transform hover:bg-transparent ${navSettings.isNavOpen ? 'rotate-180' : 'rotate-0'
                }`}
            >
              <NavTrigger />
            </span>
          </SidebarTrigger>
        </SidebarHeader>

        <SidebarGroup className="pl-3">
          <SidebarMenu className="flex flex-col  gap-y-[13px]">
            {navSettings.secondaryNav
              ? renderNavItems(items, navSettings)
              : renderNavItemsSidebar(items, navSettings)}
          </SidebarMenu>
        </SidebarGroup>
      </Sidebar>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="left"
          className={`w-[260px] absolute !z-20 ${navSettings.isNavOpen ? 'left-[225px]' : 'left-[61px]'}  bg-[#f5f9fc] border-r pl-2  pt-4 shadow-[3px_0px_10px_0px_#D6DBDE]`}
        >
          <SheetHeader>
            <SheetTitle
              style={
                {
                  '--text-color': navSettings.textColor,
                  '--fw': navSettings.textWeight,
                } as React.CSSProperties
              }
              className="text-[#42526E] mb-[2px] pl-[6px] text-[18px]"
            >
              {sheetItem?.title}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 pl-3">
            {sheetItem?.items && renderSheetSidebar(sheetItem.items)}
          </div>
        </SheetContent>
      </Sheet>

      <SearchCommand
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
        navItems={items}
        navSettings={navSettings}
      />
    </>
  )
}
