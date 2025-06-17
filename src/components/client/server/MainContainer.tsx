import { ChevronRight } from 'lucide-react'
import ThemeSwitcher from '../ThemeToggle'

const MainContainer = ({children}: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 relative items-center grid grid-rows-[50px_1fr] overflow-auto bg-parentbackground">
      <div className="flex justify-between items-center h-full ">
        <div className="flex items-center w-full bg-parentbackground justify-between gap-2 md:gap-[4px] ">
          <div className='flex items-center justify-between gap-2 md:gap-[4px] '>
          <div className="ml-5 font-normal text-sm text-[#4A5A76]">
            Employee Details
          </div>
          <div>
            <ChevronRight className="w-[15px] text-muted-foreground" />
          </div>
          <div className="font-500 text-[14px] text-[#3374EF]">
            Create Employee Details
          </div>
          </div>
          <div>
          <ThemeSwitcher/>
          </div>
        </div>
      </div>
      <div className="md:pb-[11px] sm:pl-[21px] bg-parentbackground rounded-[8px]  md:pl-0 sm:pr-[25px] h-full overflow-x-hidden">
      {/* it is Not working Because it is not configuer in the tailwind (parentbackground)
       */}
        {children}
      </div>
    </div>

  )
}

export default MainContainer