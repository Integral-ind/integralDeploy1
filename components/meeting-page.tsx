"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, Calendar, Users } from "lucide-react"

interface MeetingNote {
  id: string
  title: string
  date: string
  attendees: string
  notes: string
  actionItems: string
  createdAt: string
}

export default function MeetingNotes() {
  const [meetings, setMeetings] = useState<MeetingNote[]>([])
  const [newMeeting, setNewMeeting] = useState<Omit<MeetingNote, "id" | "createdAt">>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    attendees: "",
    notes: "",
    actionItems: "",
  })
  const [open, setOpen] = useState(false)

  const handleAddMeeting = () => {
    if (!newMeeting.title) return

    const meeting: MeetingNote = {
      id: crypto.randomUUID(),
      title: newMeeting.title,
      date: newMeeting.date,
      attendees: newMeeting.attendees,
      notes: newMeeting.notes,
      actionItems: newMeeting.actionItems,
      createdAt: new Date().toISOString(),
    }

    setMeetings([...meetings, meeting])
    setNewMeeting({
      title: "",
      date: new Date().toISOString().split("T")[0],
      attendees: "",
      notes: "",
      actionItems: "",
    })
    setOpen(false)
  }

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id))
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meeting Notes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Meeting Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Meeting Note</DialogTitle>
              <DialogDescription>Record details and action items from your meeting.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  placeholder="Meeting title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Meeting Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attendees">Attendees</Label>
                <Input
                  id="attendees"
                  value={newMeeting.attendees}
                  onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                  placeholder="Names of attendees (comma separated)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Meeting Notes</Label>
                <Textarea
                  id="notes"
                  value={newMeeting.notes}
                  onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                  placeholder="Key points discussed"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="actionItems">Action Items</Label>
                <Textarea
                  id="actionItems"
                  value={newMeeting.actionItems}
                  onChange={(e) => setNewMeeting({ ...newMeeting, actionItems: e.target.value })}
                  placeholder="Tasks to be completed (one per line)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMeeting}>Save Meeting Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">No meeting notes yet</h3>
          <p className="text-muted-foreground mt-1">Add a new meeting note to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{meeting.title}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteMeeting(meeting.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(meeting.date).toLocaleDateString()}
                  </span>
                  {meeting.attendees && (
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {meeting.attendees.split(",").length} attendees
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {meeting.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{meeting.notes}</p>
                  </div>
                )}
                {meeting.actionItems && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Action Items</h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {meeting.actionItems
                        .split("\n")
                        .filter(Boolean)
                        .map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  View Full Notes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

