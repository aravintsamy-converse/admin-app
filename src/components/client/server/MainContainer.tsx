import { ChevronRight } from 'lucide-react'
import ThemeSwitcher from '../ThemeToggle'

const MainContainer = ({children}: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 relative items-center grid grid-rows-[50px_1fr] overflow-auto">
      <div className="flex justify-between items-center pr-[10px] h-full ">
        <div className="flex items-center w-full bg-sidebar-accent justify-between gap-2 md:gap-[4px] ">
          <div className='flex items-center justify-between gap-2 md:gap-[4px] '>
          <div className="ml-5 font-normal text-sm text-[#4A5A76]">
            Employee Details
          </div>
          <div>
            <ChevronRight className="w-[15px] text-muted-foreground" />
          </div>
          <div className="font-medium text-sm text-[#3374ef]">
            Create Employee Details
          </div>
          </div>
          <div>
          <ThemeSwitcher/>
          </div>
        </div>
      </div>
      <div className="md:pb-[11px] sm:pl-[21px] md:pl-0 sm:pr-[21px] h-full overflow-x-hidden">
        {children}
      </div>
    </div>

  )
}

export default MainContainer