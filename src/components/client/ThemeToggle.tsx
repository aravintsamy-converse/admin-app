'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const colorThemes = [
  { hex: 'df3b3b', color: 'red' },
  { hex: 'e4335a', color: 'rose' },
  { hex: 'f9802d', color: 'orange' },
  { hex: '2dac5c', color: 'green' },
  { hex: 'ffc519', color: 'yellow' },
  { hex: '884dee', color: 'violet' },
]
const ThemeSwitcher = () => {
  const [baseTheme, setBaseTheme] = useState<'light' | 'dark'>()
  const [colorTheme, setColorTheme] = useState<string>('')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const savedColor = localStorage.getItem('colorTheme')

    if (savedTheme) setBaseTheme(savedTheme)
    if (savedColor) setColorTheme(savedColor)
  }, [])

  useEffect(() => {
    if (baseTheme) localStorage.setItem('theme', baseTheme)
  }, [baseTheme])
  useEffect(() => {
    if (colorTheme) {
      localStorage.setItem('colorTheme', colorTheme)
    } else {
      localStorage.removeItem('colorTheme')
    }
  }, [colorTheme])
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(
      ...colorThemes.flatMap((color) => [color.color, `${color.color}-dark`])
    )

    if (baseTheme === 'dark') {
      root.classList.add('dark')
      // root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      // root.style.colorScheme = 'light'
    }

    if (colorTheme) {
      const themeClass =
        baseTheme === 'dark' ? `${colorTheme}-dark` : colorTheme
      root.classList.add(themeClass)
    }
  }, [baseTheme, colorTheme])

  return (
    <>
      <div className="flex  gap-4 p-4">
        <div className="flex items-center gap-3">
          <Button
            aria-label="Light Mode"
            className="hover:text-primary  rounded-full outline-none border-none h-6 p-0 w-6 transition-all duration-300 focus:border-border"
            variant={baseTheme === 'light' ? 'default' : 'outline'}
            onClick={() => setBaseTheme('light')}
          >
            <Sun />
          </Button>
          <Button
            aria-label="Dark Mode"
            className=" hover:text-primary rounded-full outline-none border-none h-6 p-0 w-6 transition-all duration-300 focus:border-border"
            variant={baseTheme === 'dark' ? 'default' : 'outline'}
            onClick={() => setBaseTheme('dark')}
          >
            <Moon />
          </Button>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          {colorThemes.map((color) => (
            <Button
              key={color.color}
              onClick={() =>
                setColorTheme((prev) =>
                  prev === color.color ? '' : color.color
                )
              }
              className={` rounded-full outline-none border-none h-5 p-0 w-5 transition-all duration-300 focus:border-border`}
              variant={colorTheme === color.color ? 'default' : 'outline'}
            >
              <span
                style={{ backgroundColor: `#${color.hex}` }}
                className={` h-3 w-3  rounded-full`}
              ></span>
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}

export default ThemeSwitcher
