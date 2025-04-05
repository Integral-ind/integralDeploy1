"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bold, Italic, Underline, Link, Search, Plus, Share2, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Note {
  id: string
  title: string
  date: string
  content: string
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note1",
      title: "Meeting Notes",
      date: "Mar 10, 2025",
      content: `
      <h1>Meeting Notes</h1>
      <p>Date: March 10, 2025</p>
      <p>Attendees: Sarah, David, Lisa, John</p>
      <h2>Agenda</h2>
      <ul>
        <li>Project timeline review</li>
        <li>Budget approval</li>
        <li>Resource allocation</li>
      </ul>
      <h2>Action Items</h2>
      <ul>
        <li>David to prepare financial report by March 25</li>
        <li>Lisa to draft client proposal by March 30</li>
        <li>Follow-up meeting scheduled for March 20</li>
      </ul>
    `,
    },
    {
      id: "note2",
      title: "Project Ideas",
      date: "Mar 8, 2025",
      content: "<h1>Project Ideas</h1><p>Brainstorming session results...</p>",
    },
  ])

  const [activeNoteId, setActiveNoteId] = useState("note1")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const activeNote = notes.find((note) => note.id === activeNoteId) || notes[0]

  const handleFormatClick = (format: string) => {
    // In a real app, this would apply formatting to the selected text
    toast({
      title: "Format Applied",
      description: `Applied ${format} formatting`,
    })
  }

  const handleSaveNote = () => {
    toast({
      title: "Note Saved",
      description: "Your note has been saved successfully",
    })
  }

  const handleShareNote = () => {
    toast({
      title: "Share Options",
      description: "Sharing options would appear here",
    })
  }

  const handleNewNote = () => {
    const newNote: Note = {
      id: `note${Date.now()}`,
      title: "New Note",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      content: "<h1>New Note</h1><p>Start typing here...</p>",
    }

    setNotes([newNote, ...notes])
    setActiveNoteId(newNote.id)

    toast({
      title: "New Note Created",
      description: "You can start editing your new note",
    })
  }

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card className="h-[calc(100vh-140px)]">
      <CardContent className="p-0 h-full flex">
        <div className="w-64 border-r border-border h-full flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                className={cn(
                  "w-full text-left p-3 border-b border-border hover:bg-accent/50 transition-colors",
                  note.id === activeNoteId && "bg-accent",
                )}
                onClick={() => setActiveNoteId(note.id)}
              >
                <div className="font-medium">{note.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{note.date}</div>
              </button>
            ))}
          </div>

          <Button variant="ghost" className="m-2 justify-start" onClick={handleNewNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        <div className="flex-1 flex flex-col h-full">
          <div className="p-2 border-b border-border flex items-center flex-wrap gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleFormatClick("bold")}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormatClick("italic")}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormatClick("underline")}>
              <Underline className="h-4 w-4" />
            </Button>

            <Select defaultValue="p">
              <SelectTrigger className="w-[110px] h-8">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p">Normal</SelectItem>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={() => handleFormatClick("link")}>
              <Link className="h-4 w-4" />
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShareNote}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button size="sm" onClick={handleSaveNote}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <div
            className="flex-1 p-4 overflow-auto prose prose-sm max-w-none dark:prose-invert"
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: activeNote.content }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

