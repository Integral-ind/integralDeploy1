"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MeetingNote {
  id: string
  title: string
  date: string
}

export default function MeetingNotes() {
  const meetingNotes: MeetingNote[] = [
    { id: "mn1", title: "Weekly Team Meeting", date: "Mar 10, 2025" },
    { id: "mn2", title: "Client Presentation", date: "Mar 5, 2025" },
  ]

  const { toast } = useToast()

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Meeting Note",
      description: `Editing note ${id}`,
    })
  }

  const handleDelete = (id: string) => {
    toast({
      title: "Delete Meeting Note",
      description: `Note would be deleted`,
      variant: "destructive",
    })
  }

  const handleAddNew = () => {
    toast({
      title: "New Meeting Note",
      description: "Create a new meeting note",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meeting Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetingNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between p-4 border rounded-md hover:bg-accent/50 transition-colors"
              >
                <div>
                  <div className="text-sm text-muted-foreground">{note.date}</div>
                  <div className="font-medium">{note.title}</div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(note.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full py-6 border-dashed" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Meeting Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

