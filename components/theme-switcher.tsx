"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Palette, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { toast } = useToast()
  const [colorTheme, setColorTheme] = useState<string>("default")
  const [mode, setMode] = useState<"light" | "dark" | "system">("system")

  // Load saved theme preferences on mount
  useEffect(() => {
    setMounted(true)

    // Load saved color theme
    const savedColorTheme = localStorage.getItem("integral-color-theme") || "default"
    setColorTheme(savedColorTheme)

    // Load saved mode
    const savedMode = localStorage.getItem("integral-mode") || "system"
    setMode(savedMode as "light" | "dark" | "system")

    // Apply the saved theme
    applyTheme(savedColorTheme, savedMode as "light" | "dark" | "system")
  }, [])

  // Apply theme based on color theme and mode
  const applyTheme = (color: string, themeMode: "light" | "dark" | "system") => {
    // Remove all theme classes first
    document.documentElement.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        document.documentElement.classList.remove(className)
      }
    })

    // Add the color theme class if it's not default
    if (color !== "default") {
      document.documentElement.classList.add(`theme-${color}`)
    }

    // Set the mode using next-themes
    setTheme(themeMode)

    // Force a theme change event
    setTimeout(() => {
      window.dispatchEvent(new Event("themeChange"))
    }, 50)
  }

  const handleColorThemeChange = (newColorTheme: string) => {
    // Save to localStorage
    localStorage.setItem("integral-color-theme", newColorTheme)
    setColorTheme(newColorTheme)

    // Apply the theme
    applyTheme(newColorTheme, mode)

    toast({
      title: "Theme Changed",
      description: `Color theme set to ${newColorTheme === "default" ? "Default" : newColorTheme.charAt(0).toUpperCase() + newColorTheme.slice(1)}`,
    })
  }

  const handleModeChange = (newMode: "light" | "dark" | "system") => {
    // Save to localStorage
    localStorage.setItem("integral-mode", newMode)
    setMode(newMode)

    // Apply the theme
    applyTheme(colorTheme, newMode)

    toast({
      title: "Mode Changed",
      description: `Mode set to ${newMode.charAt(0).toUpperCase() + newMode.slice(1)}`,
    })
  }

  if (!mounted) return null

  const colorThemes = [
    { name: "default", label: "Default", color: "bg-gradient-to-br from-blue-500 to-blue-400" },
    { name: "forest", label: "Forest", color: "bg-gradient-to-br from-green-700 to-green-500" },
    { name: "sunset", label: "Sunset", color: "bg-gradient-to-br from-orange-500 to-pink-500" },
    { name: "ocean", label: "Ocean", color: "bg-gradient-to-br from-blue-700 to-blue-500" },
    { name: "purple", label: "Purple", color: "bg-gradient-to-br from-purple-700 to-purple-500" },
    { name: "amber", label: "Amber", color: "bg-gradient-to-br from-amber-600 to-amber-400" },
    { name: "mint", label: "Mint", color: "bg-gradient-to-br from-teal-500 to-teal-300" },
    { name: "rose", label: "Rose", color: "bg-gradient-to-br from-rose-600 to-rose-400" },
    { name: "indigo", label: "Indigo", color: "bg-gradient-to-br from-indigo-600 to-indigo-400" },
  ]

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
      >
        <Palette size={20} />
      </Button>

      <div
        className={cn(
          "fixed bottom-24 right-6 bg-card border border-border rounded-lg shadow-lg p-4 z-50 transition-all duration-300 transform",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
        )}
      >
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-border">
          <h3 className="font-medium">Theme Settings</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </div>

        {/* Mode Selector */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Mode</h4>
          <Tabs value={mode} onValueChange={(value) => handleModeChange(value as "light" | "dark" | "system")}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="light" className="flex items-center gap-1">
                <Sun className="h-3.5 w-3.5" />
                <span>Light</span>
              </TabsTrigger>
              <TabsTrigger value="dark" className="flex items-center gap-1">
                <Moon className="h-3.5 w-3.5" />
                <span>Dark</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-1">
                <Monitor className="h-3.5 w-3.5" />
                <span>System</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Color Theme Selector */}
        <div>
          <h4 className="text-sm font-medium mb-2">Color Theme</h4>
          <div className="grid grid-cols-3 gap-3 w-full">
            {colorThemes.map((t) => (
              <button
                key={t.name}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
                  colorTheme === t.name ? "bg-accent" : "hover:bg-muted",
                )}
                onClick={() => handleColorThemeChange(t.name)}
              >
                <div className={cn("w-8 h-8 rounded-full mb-1", t.color)} />
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Current theme:{" "}
            <span className="font-medium text-foreground">{colorTheme === "default" ? "Default" : colorTheme}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Mode: <span className="font-medium text-foreground">{resolvedTheme === "dark" ? "Dark" : "Light"}</span>
          </div>
        </div>
      </div>
    </>
  )
}

