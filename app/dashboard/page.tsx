"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Sidebar from "@/components/sidebar"
import Dashboard from "@/components/dashboard"
import Taskboard from "@/components/taskboard"
import Calendar from "@/components/calendar"
import NotesV2 from "@/components/notes-v2"
import Resources from "@/components/resources"
import Header from "@/components/header"
import ThemeSwitcher from "@/components/theme-switcher"
import { SearchDialog } from "@/components/search-dialog"
import { AddEventDialog } from "@/components/add-event-dialog"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

// Update the imports for the moved components
import Settings from "@/components/settings"
import Projects from "@/components/projects-page"
import MeetingNotes from "@/components/meeting-page"
import ReadingList from "@/components/reading-page"

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [addEventOpen, setAddEventOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [mounted, setMounted] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { isMobile } = useMobile()

  useEffect(() => {
    setMounted(true)

    // Check if there's a stored sidebar state
    const storedSidebarState = localStorage.getItem("sidebar-collapsed") === "true"

    // On mobile, default to collapsed sidebar
    if (isMobile) {
      setSidebarCollapsed(true)
    } else if (storedSidebarState) {
      setSidebarCollapsed(true)
    }

    // Show welcome toast
    setTimeout(() => {
      if (user) {
        toast({
          title: `Welcome back, ${user.name}`,
          description: "Your personal productivity workspace is ready",
        })
      }
    }, 1000)
  }, [user, toast, isMobile])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)

    // Only store preference on desktop
    if (!isMobile) {
      localStorage.setItem("sidebar-collapsed", String(newState))
    }
  }

  const handlePageChange = (page: string) => {
    setActivePage(page)

    // On mobile, auto-collapse sidebar after navigation
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }

  const getPageTitle = () => {
    const pageTitles: Record<string, string> = {
      dashboard: "Dashboard",
      todo: "Tasks",
      resources: "Resources",
      calendar: "Calendar",
      notes: "Notes",
      "meeting-notes": "Meeting Notes",
      projects: "Projects",
      reading: "Reading List",
      settings: "Settings",
    }
    return pageTitles[activePage] || "Integral"
  }

  if (loading || !mounted || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="animate-pulse text-2xl text-white">Loading Integral...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-64"
        }`}
      >
        <Header
          title={getPageTitle()}
          onSearch={() => setSearchOpen(true)}
          onAddEvent={() => setAddEventOpen(true)}
          activePage={activePage}
          user={user}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-auto p-3 md:p-6">
          {activePage === "dashboard" && <Dashboard user={user} />}
          {activePage === "todo" && <Taskboard />}
          {activePage === "resources" && <Resources />}
          {activePage === "calendar" && <Calendar onAddEvent={() => setAddEventOpen(true)} />}
          {activePage === "notes" && <NotesV2 />}
          {activePage === "meeting-notes" && <MeetingNotes />}
          {activePage === "projects" && <Projects />}
          {activePage === "reading" && <ReadingList />}
          {activePage === "settings" && <Settings />}
        </main>
      </div>

      <ThemeSwitcher />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <AddEventDialog open={addEventOpen} onOpenChange={setAddEventOpen} editEvent={editingEvent} />
      <Toaster />
    </div>
  )
}

