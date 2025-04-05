"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add event emission for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const event = new Event("themeChange")
      window.dispatchEvent(event)
    }

    // Create a MutationObserver to detect theme class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          handleThemeChange()
        }
      })
    })

    // Start observing the html element for class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

