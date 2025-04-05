"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCalendar, type CalendarEvent } from "@/lib/calendar-context"

interface AddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editEvent?: CalendarEvent | null
  onEventAdded?: (event: CalendarEvent) => void
  onEventUpdated?: (event: CalendarEvent) => void
}

export function AddEventDialog({
  open,
  onOpenChange,
  editEvent = null,
  onEventAdded,
  onEventUpdated,
}: AddEventDialogProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"meeting" | "task" | "personal" | "other">("meeting")
  const { toast } = useToast()
  const { addEvent, updateEvent } = useCalendar()

  // Reset form when dialog opens/closes or when editEvent changes
  useEffect(() => {
    if (open) {
      if (editEvent) {
        // Populate form with event data for editing
        setTitle(editEvent.title)
        setDate(editEvent.date)
        setStartTime(editEvent.startTime || "")
        setEndTime(editEvent.endTime || "")
        setDescription(editEvent.description || "")
        setCategory(editEvent.type)
      } else {
        // Set default values for new event
        setTitle("")
        setDate("")
        setStartTime("")
        setEndTime("")
        setDescription("")
        setCategory("meeting")
      }
    }
  }, [open, editEvent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return
    }

    const eventData: Omit<CalendarEvent, "id"> = {
      title,
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      description: description || undefined,
      type: category,
    }

    if (editEvent) {
      // Update existing event
      updateEvent(editEvent.id, eventData)
      if (onEventUpdated) {
        onEventUpdated({ ...eventData, id: editEvent.id })
      }
    } else {
      // Add new event
      const newEvent = addEvent(eventData)
      if (onEventAdded) {
        onEventAdded(newEvent)
      }
    }

    // Close dialog
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editEvent ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editEvent ? "Update" : "Save"} Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

