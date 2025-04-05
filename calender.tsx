"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Menu,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  X,
  CalendarIcon,
  Clock,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useCalendar, type CalendarEvent } from "@/lib/calendar-context"
import { AddEventDialog } from "@/components/add-event-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"

interface CalendarProps {
  onAddEvent: () => void
}

export default function Calendar({ onAddEvent }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("week")
  const [syncTasks, setSyncTasks] = useState(true)
  const [addEventOpen, setAddEventOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const calendarRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "dark"

  const { toast } = useToast()
  const { events, getEventsForDate, getEventsForDay, deleteEvent, addEvent } = useCalendar()
  const { user } = useAuth()

  // Use the actual current date and time instead of demo date
  useEffect(() => {
    // Show AI popup after 5 seconds if there are few events
    const popupTimer = setTimeout(() => {
      if (events.length < 5) {
        setShowAIPopup(true)
      }
    }, 5000)

    return () => clearTimeout(popupTimer)
  }, [events.length])

  // Type out the AI suggestion
  useEffect(() => {
    if (showAIPopup) {
      const text =
        "Looks like you don't have that many events today. Would you like me to suggest some time blocks for focused work?"
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText((prev) => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    }
  }, [showAIPopup])

  // Scroll to current time on initial load
  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentHour = new Date().getHours()
      // Scroll to current hour (adjust as needed)
      const scrollPosition = Math.max(0, (currentHour - 1) * 60)
      scrollContainerRef.current.scrollTop = scrollPosition
    }
  }, [currentView])

  // Add this useEffect to ensure theme consistency
  useEffect(() => {
    // Force theme-related re-renders when theme changes
    const handleThemeChange = () => {
      if (calendarRef.current) {
        // Trigger a layout recalculation
        calendarRef.current.style.opacity = "0.99"
        setTimeout(() => {
          if (calendarRef.current) {
            calendarRef.current.style.opacity = "1"
          }
        }, 10)
      }
    }

    window.addEventListener("themeChange", handleThemeChange)
    return () => {
      window.removeEventListener("themeChange", handleThemeChange)
    }
  }, [])

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    // Use actual current date
    const todayDate = new Date()
    setCurrentDate(todayDate)

    // Scroll to current time
    if (scrollContainerRef.current) {
      const currentHour = new Date().getHours()
      const scrollPosition = Math.max(0, (currentHour - 1) * 60)
      scrollContainerRef.current.scrollTop = scrollPosition
    }
  }

  const getMonthName = () => {
    if (currentView === "month") {
      return currentDate.toLocaleString("default", { month: "long", year: "numeric" })
    } else if (currentView === "week") {
      return `${currentDate.toLocaleString("default", { month: "long" })} ${currentDate.getDate()}`
    } else {
      return currentDate.toLocaleString("default", { weekday: "long", month: "long", day: "numeric" })
    }
  }

  // Generate days for mini calendar
  const generateMiniCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Create array for all days
    const days = []

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  // Generate days for month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of month and total days
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate()
    const prevDays = []
    for (let i = firstDay - 1; i >= 0; i--) {
      prevDays.push({
        day: prevMonthDays - i,
        isPrevMonth: true,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
      })
    }

    // Current month days
    const currentDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = isCurrentDay(new Date(year, month, i))
      currentDays.push({
        day: i,
        isToday,
        month,
        year,
      })
    }

    // Next month days
    const totalCells = 42 // 6 rows of 7 days
    const remainingCells = totalCells - (firstDay + daysInMonth)
    const nextDays = []
    for (let i = 1; i <= remainingCells; i++) {
      nextDays.push({
        day: i,
        isNextMonth: true,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
      })
    }

    return [...prevDays, ...currentDays, ...nextDays]
  }

  // Generate days for week view
  const generateWeekDays = () => {
    const days = []
    const startOfWeek = new Date(currentDate)
    // Adjust to start from Sunday
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }

    return days
  }

  // Generate hours for week view (24 hours)
  const generateHours = () => {
    const hours = []
    for (let i = 0; i < 24; i++) {
      hours.push(i)
    }
    return hours
  }

  // Check if date is today
  const isCurrentDay = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Check if date is the selected date
  const isSelectedDay = (date: Date) => {
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    )
  }

  // Format time (HH:MM)
  const formatTime = (time?: string) => {
    if (!time) return ""

    const [hours, minutes] = time.split(":")
    return `${hours}:${minutes}`
  }

  // Format time for display in events (HH:MM)
  const formatEventTime = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return ""

    const [startHours, startMinutes] = startTime.split(":")
    const [endHours, endMinutes] = endTime.split(":")

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`
  }

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  // Handle event edit
  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setAddEventOpen(true)
  }

  // Handle event delete
  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId)
  }

  // Sync tasks from taskboard to calendar
  const syncTasksToCalendar = () => {
    if (syncTasks) {
      toast({
        title: "Tasks Synced",
        description: "Tasks have been synced to the calendar",
      })
    } else {
      toast({
        title: "Tasks Hidden",
        description: "Tasks have been hidden from the calendar",
      })
    }
  }

  // Effect to sync tasks when the toggle changes
  useEffect(() => {
    syncTasksToCalendar()
  }, [syncTasks])

  // Helper function to calculate event position and height for week view
  const calculateEventStyle = (startTime: string, endTime: string) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = start * 60 // 60px per hour
    const height = (end - start) * 60
    return { top: `${top}px`, height: `${height}px` }
  }

  // Filter events based on search query
  const filterEvents = (eventsToFilter: CalendarEvent[]) => {
    if (!searchQuery) return eventsToFilter

    return eventsToFilter.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  // Get event color based on type
  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      case "task":
        return "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
      case "personal":
        return "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
      case "other":
        return "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
      default:
        return "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
    }
  }

  // Sample my calendars for the sidebar
  const myCalendars = [
    { name: "My Calendar", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Personal", color: "bg-purple-500" },
    { name: "Family", color: "bg-orange-500" },
  ]

  const addSuggestedEvents = useCallback(
    (focusBlocks: any[]) => {
      focusBlocks.forEach((block) => {
        // Ensure the date is properly formatted
        const eventDate = block.date

        // Log the event being added for debugging
        console.log(`Adding focus block for date: ${eventDate}`)

        // Add the event
        addEvent({
          ...block,
          date: eventDate,
        })
      })
    },
    [addEvent],
  )

  // Get day name abbreviation
  const getDayAbbr = (day: number) => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    return days[day]
  }

  // Determine if we're using dark mode

  // Update the mini calendar navigation handlers
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  // Get the current month and year for the mini calendar
  const getCurrentMonthYear = () => {
    return currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  }

  return (
    <div
      className={cn(
        "flex h-[calc(100vh-140px)] overflow-hidden rounded-lg",
        isDarkMode ? "bg-background" : "bg-background",
      )}
    >
      {/* Left Sidebar */}
      <div
        className={cn(
          "flex-shrink-0 border-r transition-all duration-300 overflow-y-auto",
          isDarkMode ? "bg-card border-border" : "bg-card border-border",
          sidebarOpen ? "w-64" : "w-0",
        )}
      >
        <div className="p-4">
          <Button
            variant="default"
            className="w-full mb-6 flex items-center justify-center gap-2"
            onClick={() => setAddEventOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Create
          </Button>

          {/* Mini Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{getCurrentMonthYear()}</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-xs text-muted-foreground font-medium py-1">
                  {day}
                </div>
              ))}

              {generateMiniCalendarDays().map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    "text-xs rounded-full w-7 h-7 flex items-center justify-center",
                    day === currentDate.getDate() && new Date().getMonth() === currentDate.getMonth()
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/50 hover:text-accent-foreground cursor-pointer",
                    !day && "invisible",
                  )}
                  onClick={() => {
                    if (day) {
                      // Create a new date with the same year and month as currentDate, but with the selected day
                      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                      setCurrentDate(newDate)
                    }
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* My Calendars */}
          <div>
            <h3 className="text-lg font-medium mb-3">My calendars</h3>
            <div className="space-y-2">
              {myCalendars.map((cal, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cal.color}`}></div>
                  <span className="text-sm">{cal.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox id="syncTasksToggle" checked={syncTasks} onCheckedChange={(checked) => setSyncTasks(!!checked)} />
            <Label htmlFor="syncTasksToggle">Show tasks on calendar</Label>
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="border-b p-3 flex items-center justify-between bg-card border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Calendar</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8 bg-primary">
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="border-b p-3 flex flex-wrap items-center justify-between gap-3 bg-card border-border">
          <div className="flex items-center gap-2">
            <Button variant="default" onClick={handleToday}>
              Today
            </Button>
            <div className="flex">
              <Button variant="ghost" size="icon" onClick={handlePrevious}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold">{getMonthName()}</h2>
          </div>

          <div className="flex items-center gap-2 bg-muted rounded-md p-1">
            <Button
              variant={currentView === "day" ? "default" : "ghost"}
              className={currentView === "day" ? "" : ""}
              onClick={() => setCurrentView("day")}
            >
              Day
            </Button>
            <Button
              variant={currentView === "week" ? "default" : "ghost"}
              className={currentView === "week" ? "" : ""}
              onClick={() => setCurrentView("week")}
            >
              Week
            </Button>
            <Button
              variant={currentView === "month" ? "default" : "ghost"}
              className={currentView === "month" ? "" : ""}
              onClick={() => setCurrentView("month")}
            >
              Month
            </Button>
          </div>
        </div>

        {/* Calendar Views */}
        <div className="flex-1 overflow-hidden" ref={calendarRef}>
          {/* Month View */}
          {currentView === "month" && (
            <div className="h-full overflow-y-auto">
              <div className="min-w-[800px]">
                {/* Month Header */}
                <div className="grid grid-cols-7 border-b sticky top-0 z-10 bg-card border-border">
                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                    <div key={day} className="p-2 text-center font-medium text-sm border-r last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-7">
                  {generateMonthDays().map((day, index) => {
                    const dayEvents =
                      day.isPrevMonth || day.isNextMonth
                        ? []
                        : filterEvents(getEventsForDay(day.day, day.month, day.year))

                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-[100px] p-1 border-r border-b relative",
                          (day.isPrevMonth || day.isNextMonth) && "bg-muted/30 text-muted-foreground",
                          day.isToday && "bg-primary/5",
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 flex items-center justify-center text-sm rounded-full mb-1",
                            day.isToday && "bg-primary text-primary-foreground font-medium",
                          )}
                        >
                          {day.day}
                        </div>

                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={cn(
                                "text-xs px-1 py-0.5 rounded truncate cursor-pointer group relative",
                                getEventColor(event.type),
                                "text-white",
                              )}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="font-medium">
                                {event.startTime && `${event.startTime.substring(0, 5)} `}
                                {event.title}
                              </div>
                            </div>
                          ))}

                          {dayEvents.length > 3 && (
                            <div className="text-xs text-muted-foreground px-1 cursor-pointer hover:text-foreground">
                              + {dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Week View */}
          {currentView === "week" && (
            <div className="h-full overflow-y-auto" ref={scrollContainerRef}>
              <div className="min-w-[800px]">
                {/* Week Header */}
                <div className="grid grid-cols-8 border-b sticky top-0 z-10 bg-card border-border">
                  <div className="p-2 text-center text-muted-foreground text-sm"></div>
                  {generateWeekDays().map((day, index) => {
                    const isToday = isCurrentDay(day)
                    const isSelected = isSelectedDay(day)
                    const dayNumber = day.getDate()
                    const dayName = getDayAbbr(day.getDay())

                    return (
                      <div key={index} className={cn("p-2 text-center border-l", isToday && "bg-primary/10")}>
                        <div className="text-xs text-muted-foreground font-medium">{dayName}</div>
                        <div
                          className={cn(
                            "text-lg font-medium mt-1",
                            isSelected &&
                              "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto",
                          )}
                        >
                          {dayNumber}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Time Grid */}
                <div className="grid grid-cols-8">
                  {/* Time Labels */}
                  <div className="text-muted-foreground">
                    {generateHours().map((hour) => (
                      <div key={hour} className="h-[60px] border-b pr-2 text-right text-xs">
                        {hour > 0 ? (hour > 12 ? `${hour - 12} PM` : `${hour} AM`) : "12 AM"}
                      </div>
                    ))}
                  </div>

                  {/* Days Columns */}
                  {generateWeekDays().map((day, dayIndex) => {
                    const dayEvents = filterEvents(getEventsForDate(day))
                    const isToday = isCurrentDay(day)

                    return (
                      <div key={dayIndex} className="border-l relative">
                        {generateHours().map((hour) => (
                          <div
                            key={hour}
                            className={cn(
                              "h-[60px] border-b",
                              isSelectedDay(day) && "bg-accent/30",
                              isToday && hour === new Date().getHours() && "bg-primary/5",
                            )}
                          ></div>
                        ))}

                        {/* Current time indicator for today */}
                        {isToday && (
                          <div
                            className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                            style={{
                              top: `${new Date().getHours() * 60 + Math.floor((new Date().getMinutes() / 60) * 60)}px`,
                            }}
                          >
                            <div className="absolute -top-2 -left-1 w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                        )}

                        {/* Events */}
                        {dayEvents.map((event, eventIndex) => {
                          if (!event.startTime || !event.endTime) return null

                          const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                          const eventColor = getEventColor(event.type)

                          return (
                            <div
                              key={eventIndex}
                              className={cn(
                                "absolute left-1 right-1 px-2 py-1 rounded text-xs text-white overflow-hidden cursor-pointer transition-all",
                                eventColor,
                                "hover:shadow-lg",
                              )}
                              style={eventStyle}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="font-medium">{event.title}</div>
                              <div className="opacity-90 text-[10px]">
                                {formatEventTime(event.startTime, event.endTime)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Day View */}
          {currentView === "day" && (
            <div className="h-full overflow-y-auto" ref={scrollContainerRef}>
              <div className="min-w-[800px]">
                {/* Day Header */}
                <div className="p-4 border-b bg-card border-border">
                  <h3 className="font-medium">
                    {currentDate.toLocaleString("default", { weekday: "long", month: "long", day: "numeric" })}
                  </h3>
                </div>
                <div className="grid grid-cols-2">
                  {/* Time Labels */}
                  <div className="text-muted-foreground">
                    {generateHours().map((hour) => (
                      <div key={hour} className="h-[60px] border-b pr-2 text-right text-xs">
                        {hour > 0 ? (hour > 12 ? `${hour - 12} PM` : `${hour} AM`) : "12 AM"}
                      </div>
                    ))}
                  </div>

                  {/* Day Column */}
                  <div className="border-l relative">
                    {generateHours().map((hour) => (
                      <div
                        key={hour}
                        className={cn(
                          "h-[60px] border-b",
                          hour === new Date().getHours() && isCurrentDay(currentDate) && "bg-primary/5",
                        )}
                      ></div>
                    ))}

                    {/* Current time indicator for today */}
                    {isCurrentDay(currentDate) && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                        style={{
                          top: `${new Date().getHours() * 60 + Math.floor((new Date().getMinutes() / 60) * 60)}px`,
                        }}
                      >
                        <div className="absolute -top-2 -left-1 w-2 h-2 rounded-full bg-red-500"></div>
                      </div>
                    )}

                    {/* Events */}
                    {filterEvents(getEventsForDate(currentDate)).map((event, eventIndex) => {
                      if (!event.startTime || !event.endTime) return null

                      const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                      const eventColor = getEventColor(event.type)

                      return (
                        <div
                          key={eventIndex}
                          className={cn(
                            "absolute left-1 right-1 px-2 py-1 rounded text-xs text-white overflow-hidden cursor-pointer transition-all",
                            eventColor,
                            "hover:shadow-lg",
                          )}
                          style={eventStyle}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="opacity-90 text-[10px]">
                            {formatEventTime(event.startTime, event.endTime)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestion Popup */}
      {showAIPopup && (
        <div className="fixed bottom-6 right-6 w-80 bg-card shadow-lg rounded-lg border border-border z-50">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium text-sm">AI Assistant</h3>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowAIPopup(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-sm">{typedText}</div>
            {typedText.length ===
              "Looks like you don't have that many events today. Would you like me to suggest some time blocks for focused work?"
                .length && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    // Generate focus blocks for today
                    const today = new Date()
                    const focusBlocks = [
                      {
                        id: crypto.randomUUID(),
                        title: "Focus Block: Deep Work",
                        description: "Uninterrupted focus time for your most important task",
                        date: today.toISOString().split("T")[0],
                        startTime: "09:00",
                        endTime: "11:00",
                        type: "task",
                      },
                      {
                        id: crypto.randomUUID(),
                        title: "Focus Block: Admin Tasks",
                        description: "Time to handle emails and administrative work",
                        date: today.toISOString().split("T")[0],
                        startTime: "14:00",
                        endTime: "15:30",
                        type: "task",
                      },
                    ]
                    addSuggestedEvents(focusBlocks)
                    setShowAIPopup(false)
                    toast({
                      title: "Focus Blocks Added",
                      description: "Focus blocks have been added to your calendar",
                    })
                  }}
                >
                  Yes, please
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAIPopup(false)}>
                  No thanks
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Event Dialog */}
      {addEventOpen && (
        <AddEventDialog
          isOpen={addEventOpen}
          onClose={() => {
            setAddEventOpen(false)
            setEditingEvent(null)
          }}
          event={editingEvent}
          date={currentDate}
        />
      )}

      {/* Event Details Popup */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
          <div className="bg-card shadow-lg rounded-lg border p-4 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium">{selectedEvent.title}</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEditEvent(selectedEvent)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    handleDeleteEvent(selectedEvent.id)
                    setSelectedEvent(null)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {selectedEvent.description && (
                <div>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(selectedEvent.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {selectedEvent.startTime && selectedEvent.endTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatEventTime(selectedEvent.startTime, selectedEvent.endTime)}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${getEventColor(selectedEvent.type).split(" ")[0]}`}></div>
                <span className="capitalize">{selectedEvent.type}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

