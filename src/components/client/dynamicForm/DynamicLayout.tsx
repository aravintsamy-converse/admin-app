'use client'

import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AppSidebar } from './Sidebar'
import { defaultLayout } from '@/mockData/DynamicNav'
import { SidebarProvider } from '@/components/ui/sidebar'


export default function DynamicLayout() {


  const [layout, setLayout] = useState(defaultLayout)


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
