"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface CalendarEvent {
  id: string
  title: string
  date: string
  startTime?: string
  endTime?: string
  type: "meeting" | "task" | "personal" | "other"
  completed?: boolean
  priority?: "high" | "medium" | "low"
  description?: string
}

interface CalendarContextType {
  events: CalendarEvent[]
  addEvent: (event: Omit<CalendarEvent, "id">) => void
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  getEventsForDate: (date: Date) => CalendarEvent[]
  getEventsForDay: (day: number, month: number, year: number) => CalendarEvent[]
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "event1",
      title: "Team Meeting",
      date: "2025-03-15",
      startTime: "10:00",
      endTime: "11:00",
      type: "meeting",
      description: "Weekly team sync",
    },
    {
      id: "event2",
      title: "Client Call",
      date: "2025-03-18",
      startTime: "14:00",
      endTime: "15:00",
      type: "meeting",
      description: "Discuss project requirements",
    },
    {
      id: "event3",
      title: "Prepare Presentation",
      date: "2025-03-20",
      startTime: "09:00",
      endTime: "12:00",
      type: "task",
      completed: false,
      priority: "high",
      description: "Prepare slides for client meeting",
    },
  ])

  const { toast } = useToast()

  // Load events from localStorage on initial load
  useEffect(() => {
    const storedEvents = localStorage.getItem("integral_events")
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents))
      } catch (error) {
        console.error("Failed to parse stored events:", error)
      }
    }
  }, [])

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("integral_events", JSON.stringify(events))
  }, [events])

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event${Date.now()}`,
    }
    setEvents((prevEvents) => [...prevEvents, newEvent])

    toast({
      title: "Event Added",
      description: `${newEvent.title} has been added to your calendar`,
    })

    return newEvent
  }

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prevEvents) => prevEvents.map((event) => (event.id === id ? { ...event, ...updates } : event)))

    toast({
      title: "Event Updated",
      description: `Event has been updated successfully`,
    })
  }

  const deleteEvent = (id: string) => {
    const eventToDelete = events.find((event) => event.id === id)
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))

    toast({
      title: "Event Deleted",
      description: eventToDelete ? `"${eventToDelete.title}" has been removed` : "Event has been removed",
    })
  }

  const getEventsForDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    return events.filter((event) => event.date === dateStr)
  }

  const getEventsForDay = (day: number, month: number, year: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  return (
    <CalendarContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsForDate,
        getEventsForDay,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider")
  }
  return context
}

