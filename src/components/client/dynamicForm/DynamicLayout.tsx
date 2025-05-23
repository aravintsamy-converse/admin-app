'use client'


import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import {
  NavTrigger,
  SquarPlusIcon
} from '../icons/dynamicForm/AllDynamicFormIcons'
import { AppSidebar } from './Sidebar'
import { defaultLayout } from '@/mockData/DynamicNav'
import { useFormConfig } from '@/lib/dynamic'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ChevronRight, ChevronRightCircle } from 'lucide-react'

const gridColClasses: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1 w-[40%] ',
  2: 'grid-cols-2 w-[70%]',
  3: 'grid-cols-3 w-[100%]',
}
const getGapClass = (width: number) => {
  if (width > 1700) return 'gap-x-[9%]'
  if (width > 1000) return ' gap-x-[4%]'
  if (width > 900) return 'gap-x-[3.5%]'
  if (width > 800) return ' gap-x-[3%]'
  if (width > 600) return 'gap-x-auto'
  return 'gap-x-auto'
}

export default function DynamicLayout() {
  const form = useFormConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const handleClick = () => {
    setIsSuccess(false)
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 2000)
  }
  function onSubmit(data: any) {
    console.log('Form Data:', data)
    console.log('Form Errors:', form.formState.errors)
    handleClick()
  }
  const [computedGap, setComputedGap] = useState('gap-x-[9%]')
  const [layout, setLayout] = useState(defaultLayout)
  const [manualGridOverride, setManualGridOverride] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showRequiredFields, setShowRequiredFields] = useState(false)

  const resizing = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [computedCols, setComputedCols] = useState<1 | 2 | 3>(3)
  const [defaultPosition, setDefaultPosition] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })

  const fieldValues = form.watch()
  const requiredFields = useMemo(() => {
    return layout.form.fields.filter((f) => f.required)
  }, [layout.form.fields])

  const filledCount = useMemo(() => {
    return requiredFields.filter((field) => {
      const val = fieldValues?.[field.id]
      return val !== undefined && val !== '' && val !== null
    }).length
  }, [requiredFields, fieldValues])

  const totalRequired = requiredFields.length
  const progress = Math.round((filledCount / totalRequired) * 100)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDefaultPosition({
        x: window.innerWidth - layout.chat.width,
        y: 0,
      })
    }
  }, [layout.chat.width])
  const chatPanelRef = useRef<HTMLDivElement>(null)

  const navWidth = layout.sideNav.isNavOpen
    ? layout.sideNav.width[0]
    : layout.sideNav.width[1]

  const updateForm = (updates: any) => {
    setLayout((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        ...updates,
      },
    }))
  }

  const toggleNav = () => {
    setLayout((prev) => ({
      ...prev,
      sideNav: {
        ...prev.sideNav,
        isNavOpen: !prev.sideNav.isNavOpen,
      },
    }))
    setTimeout(() => 500)
  }
  const toggleMoblieNav = () => {
    setLayout((prev) => ({
      ...prev,
      sideNav: {
        ...prev.sideNav,
        isNavOpen: true,
        secondaryNav: false,
      },
    }))
    setTimeout(() => 500)
  }

  const startResizing = () => {
    setIsDragging(true)
    resizing.current = true
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const stopResizing = () => {
    setIsDragging(false)
    resizing.current = false
    setIsResizing(false)
    document.body.style.cursor = 'default'
    document.body.style.userSelect = 'auto'
  }
  const setLabelAlignment = (alignment: string) => {
    updateForm({
      labelAlignment: {
        ...layout.form.labelAlignment,
        current: alignment,
      },
    })
  }
  const handleMouseMove = (e: MouseEvent) => {
    if (!resizing.current) return

    let newChatWidth = window.innerWidth - e.clientX
    let clampedWidth = Math.max(
      300,
      Math.min(newChatWidth, layout.chat.maxwidth)
    )

    const availableFormWidth = e.clientX - navWidth
    if (layout.form.gridCols === 3 && availableFormWidth < 800) {
      stopResizing()
      toast.warning(
        'Not enough space for 3-column layout. Reduce columns or shrink chat.'
      )

      const adjustedClientX = e.clientX + 60
      newChatWidth = window.innerWidth - adjustedClientX
      clampedWidth = Math.max(300, Math.min(newChatWidth, layout.chat.maxwidth))

      setLayout((prev) => ({
        ...prev,
        chat: {
          ...prev.chat,
          width: clampedWidth,
        },
      }))

      return
    }
    if (!resizing.current) startResizing()

    setLayout((prev) => ({
      ...prev,
      chat: {
        ...prev.chat,
        width: clampedWidth,
      },
    }))
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', stopResizing)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [layout.form.gridCols])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        let newCols: 1 | 2 | 3 = 1
        if (width > 1000) newCols = 3
        else if (width > 600) newCols = 2
        setComputedCols(newCols)
        setComputedGap(getGapClass(width))
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [manualGridOverride, layout.form.gridCols])

  const gridColClass =
    layout.form.gridCols === 'auto'
      ? gridColClasses[computedCols]
      : gridColClasses[layout.form.gridCols as 1 | 2 | 3]

  const handleButtonClick = (cols: number) => {
    const availableFormWidth = window.innerWidth - layout.chat.width - navWidth

    if (cols === 3 && availableFormWidth < 800) {
      toast.warning(
        'Not enough space for 3-column layout. Reduce columns or shrink chat.'
      )
      return
    }

    setManualGridOverride(true)
    updateForm({ gridCols: cols })
  }
  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   fieldId: string
  // ) => {
  //   const updatedFields = layout.form.fields.map((field) =>
  //     field.id === fieldId ? { ...field, value: e.target.value } : field
  //   )
  //   updateForm({ fields: updatedFields })
  // }

  const toggleDrag = () => {
    setIsResetPosition(false)
    setLayout((prev) => ({
      ...prev,
      chat: {
        ...prev.chat,
        draggable: !prev.chat.draggable,
      },
    }))
  }
  const handleToggle = (checked: boolean) => {
    setLayout((prev) => ({
      ...prev,
      sideNav: {
        ...prev.sideNav,
        secondaryNav: checked,
      },
    }))
  }
  const [isResetPosition, setIsResetPosition] = useState(!layout.chat.draggable)

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-[#eff3f6] ">
        {/* Side Nav */}
        <SidebarProvider
          open={layout.sideNav.isNavOpen}
          onOpenChange={toggleNav}
        >
          <AppSidebar
            side={layout.sideNav.navPosition as 'left' | 'right'}
            className={`relative z-50`}
            items={layout.sideNav.navMain}
            navSettings={layout.sideNav}
            toggle={toggleNav}
          />


        </SidebarProvider>
        {/* Main Content */}
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} newestOnTop />
    </>
  )
}
