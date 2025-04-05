"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Calendar,
  FileText,
  FileSpreadsheet,
  Star,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Settings,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activePage: string
  onPageChange: (page: string) => void
  collapsed: boolean
  toggleSidebar: () => void
}

export default function Sidebar({ activePage, onPageChange, collapsed, toggleSidebar }: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const { isMobile } = useMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Mobile menu button - visible only on small screens */}
      {isMobile && collapsed && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r border-border transition-all duration-300 z-40",
          collapsed ? "w-0 md:w-16" : "w-[280px] md:w-64",
          isMobile && !collapsed ? "shadow-xl" : "",
          isMobile && collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border h-16">
          {!collapsed && <h1 className="text-xl font-semibold">Integral</h1>}
          <button
            onClick={toggleSidebar}
            className={cn(
              "p-2 rounded-md hover:bg-accent transition-colors",
              collapsed ? "mx-auto" : "",
              isMobile && collapsed ? "hidden" : "block",
            )}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="p-3 overflow-y-auto h-[calc(100%-4rem)]">
          {!collapsed && <p className="text-xs font-semibold text-muted-foreground mb-2 mt-2 px-2">HOME</p>}

          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Desk"
            page="dashboard"
            active={activePage === "dashboard"}
            collapsed={collapsed}
            onClick={() => onPageChange("dashboard")}
          />

          <NavItem
            icon={<CheckSquare size={18} className="text-emerald-500" />}
            label="Taskboard"
            page="todo"
            active={activePage === "todo"}
            collapsed={collapsed}
            onClick={() => onPageChange("todo")}
          />

          <NavItem
            icon={<FolderOpen size={18} className="text-amber-500" />}
            label="Resources"
            page="resources"
            active={activePage === "resources"}
            collapsed={collapsed}
            onClick={() => onPageChange("resources")}
          />

          <NavItem
            icon={<Calendar size={18} className="text-red-500" />}
            label="Calendar"
            page="calendar"
            active={activePage === "calendar"}
            collapsed={collapsed}
            onClick={() => onPageChange("calendar")}
          />

          <NavItem
            icon={<FileText size={18} className="text-purple-500" />}
            label="Notes"
            page="notes"
            active={activePage === "notes"}
            collapsed={collapsed}
            onClick={() => onPageChange("notes")}
          />

          {!collapsed && <p className="text-xs font-semibold text-muted-foreground mb-2 mt-4 px-2">PAGES</p>}

          <NavItem
            icon={<FileSpreadsheet size={18} className="text-blue-500" />}
            label="Meeting Notes"
            page="meeting-notes"
            active={activePage === "meeting-notes"}
            collapsed={collapsed}
            onClick={() => onPageChange("meeting-notes")}
          />

          <NavItem
            icon={<Star size={18} className="text-amber-500" />}
            label="Projects"
            page="projects"
            active={activePage === "projects"}
            collapsed={collapsed}
            onClick={() => onPageChange("projects")}
          />

          <NavItem
            icon={<BookOpen size={18} className="text-teal-500" />}
            label="Reading List"
            page="reading"
            active={activePage === "reading"}
            collapsed={collapsed}
            onClick={() => onPageChange("reading")}
          />

          <NavItem
            icon={<Settings size={18} className="text-gray-500" />}
            label="Settings"
            page="settings"
            active={activePage === "settings"}
            collapsed={collapsed}
            onClick={() => onPageChange("settings")}
          />
        </div>
      </div>

      {/* Mobile sidebar backdrop overlay */}
      {!collapsed && isMobile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30" onClick={toggleSidebar} aria-hidden="true" />
      )}
    </>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  page: string
  active: boolean
  collapsed: boolean
  onClick: () => void
}

function NavItem({ icon, label, page, active, collapsed, onClick }: NavItemProps) {
  return (
    <button
      className={cn(
        "flex items-center w-full rounded-md px-2 py-2 mb-1 transition-colors",
        active ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 text-foreground",
      )}
      onClick={onClick}
      data-page={page}
      title={collapsed ? label : undefined}
    >
      <span className={cn("flex-shrink-0", collapsed ? "mx-auto" : "mr-3")}>{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  )
}

