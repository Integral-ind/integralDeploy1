"use client"

import { useState } from "react"
import { Search, Plus, Save, LogOut, Settings, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"

interface HeaderProps {
  title: string
  onSearch: () => void
  onAddEvent?: () => void
  activePage: string
  user: any
  toggleSidebar: () => void
}

export default function Header({ title, onSearch, onAddEvent, activePage, user, toggleSidebar }: HeaderProps) {
  const [filterLabel, setFilterLabel] = useState("Filter")
  const { logout } = useAuth()
  const router = useRouter()
  const { isMobile } = useMobile()

  const handleFilter = (filter: string) => {
    setFilterLabel(filter)
    // In a real app, we would apply the filter here
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card p-3 md:p-4 sticky top-0 z-10 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg md:text-xl font-semibold truncate max-w-[200px] md:max-w-none">{title}</h1>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="outline" size="sm" onClick={onSearch} className="px-2 md:px-3">
          <Search size={16} className="md:mr-2" />
          <span className="hidden md:inline">Search</span>
        </Button>

        {activePage === "calendar" && (
          <Button size="sm" onClick={onAddEvent} className="px-2 md:px-3">
            <Plus size={16} className="md:mr-2" />
            <span className="hidden md:inline">Add Event</span>
          </Button>
        )}

        <Button size="sm" variant="default" className="px-2 md:px-3">
          <Save size={16} className="md:mr-2" />
          <span className="hidden md:inline">Save</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <User size={16} />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Settings size={16} />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

