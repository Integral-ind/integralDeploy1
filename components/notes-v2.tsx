"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Image,
  Code,
  List,
  ListOrdered,
  CheckSquare,
  Home,
  Star,
  Briefcase,
  User,
  Search,
  Plus,
  Share2,
  Save,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { AITextSummary } from "@/components/ai-text-summary"
import { AIWritingAssistant } from "@/components/ai-writing-assistant"
import { useMobile } from "@/hooks/use-mobile"

interface Note {
  id: string
  title: string
  content: string
  preview: string
  date: string
  category: string
  isFavorite: boolean
}

export default function NotesV2() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note1",
      title: "Meeting Notes",
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
      preview: "Project timeline review, budget approval, resource allocation...",
      date: "Mar 10, 2025",
      category: "work",
      isFavorite: true,
    },
    {
      id: "note2",
      title: "Weekly Goals",
      content: "<h1>Weekly Goals</h1><p>Exercise 3 times, finish book, call parents...</p>",
      preview: "Exercise 3 times, finish book, call parents...",
      date: "Mar 7, 2025",
      category: "personal",
      isFavorite: false,
    },
  ])

  const [activeNoteId, setActiveNoteId] = useState("note1")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("date-desc")
  const [showAITools, setShowAITools] = useState(false)
  const { toast } = useToast()
  const [noteSidebarOpen, setNoteSidebarOpen] = useState(true)
  const { isMobile, isTablet } = useMobile()

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setNoteSidebarOpen(false)
    } else {
      setNoteSidebarOpen(true)
    }
  }, [isMobile])

  const activeNote = notes.find((note) => note.id === activeNoteId) || notes[0]

  const filteredNotes = notes
    .filter((note) => {
      // Filter by search query
      if (searchQuery) {
        return (
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.preview.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      return true
    })
    .filter((note) => {
      // Filter by category
      if (activeCategory === "all") return true
      if (activeCategory === "favorites") return note.isFavorite
      return note.category === activeCategory
    })
    .sort((a, b) => {
      // Sort by selected order
      switch (sortOrder) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "alpha":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const handleFormatClick = (format: string) => {
    document.execCommand(format, false, null)
    toast({
      title: "Format Applied",
      description: `Applied ${format} formatting`,
    })
  }

  const handleHeadingChange = (value: string) => {
    if (value === "p") {
      document.execCommand("formatBlock", false, "p")
    } else {
      document.execCommand("formatBlock", false, value)
    }
  }

  const handleSaveNote = () => {
    const titleInput = document.querySelector(".note-title-input") as HTMLInputElement
    const contentElement = document.querySelector(".note-content") as HTMLDivElement
    const categorySelect = document.querySelector(".note-category-select") as HTMLSelectElement

    if (!titleInput || !contentElement || !categorySelect) return

    const updatedNotes = notes.map((note) => {
      if (note.id === activeNoteId) {
        const content = contentElement.innerHTML
        const textContent = contentElement.textContent || ""
        return {
          ...note,
          title: titleInput.value,
          content: content,
          preview: textContent.substring(0, 50) + "...",
          category: categorySelect.value,
        }
      }
      return note
    })

    setNotes(updatedNotes)
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
      content: "<h1>New Note</h1><p>Start writing here...</p>",
      preview: "Start writing here...",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      category: "work",
      isFavorite: false,
    }

    setNotes([newNote, ...notes])
    setActiveNoteId(newNote.id)

    // On mobile, close the sidebar after creating a new note
    if (isMobile) {
      setNoteSidebarOpen(false)
    }

    toast({
      title: "New Note Created",
      description: "You can start editing your new note",
    })
  }

  const toggleFavorite = (noteId: string) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          return { ...note, isFavorite: !note.isFavorite }
        }
        return note
      }),
    )
  }

  const handleApplyImprovedText = (text: string) => {
    const contentElement = document.querySelector(".note-content") as HTMLDivElement
    if (contentElement) {
      contentElement.innerHTML = text

      // Update note in state
      const updatedNotes = notes.map((note) => {
        if (note.id === activeNoteId) {
          return {
            ...note,
            content: text,
            preview: text.substring(0, 50) + "...",
          }
        }
        return note
      })

      setNotes(updatedNotes)
    }
  }

  const getCategoryCount = (category: string) => {
    if (category === "all") return notes.length
    if (category === "favorites") return notes.filter((note) => note.isFavorite).length
    return notes.filter((note) => note.category === category).length
  }

  return (
    <Card className="h-[calc(100vh-140px)]">
      <CardContent className="p-0 h-full flex flex-col md:flex-row">
        {/* Notes Sidebar - make it responsive */}
        <div
          className={cn(
            "border-b md:border-b-0 md:border-r border-border md:h-full flex flex-col",
            "transition-all duration-300",
            noteSidebarOpen ? "w-full md:w-64 h-64 md:h-full" : "w-full md:w-64 h-16 md:h-full",
            isMobile && !noteSidebarOpen ? "flex-shrink-0" : "",
          )}
        >
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold">My Notes</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNoteSidebarOpen(!noteSidebarOpen)}
                className="md:hidden"
                aria-label={noteSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {noteSidebarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              <Button variant="primary" size="sm" onClick={handleNewNote} className="flex items-center gap-1">
                <Plus size={16} />
                <span className="hidden md:inline">New Note</span>
              </Button>
            </div>
          </div>

          {/* Rest of the sidebar content wrapped in a conditional */}
          <div className={cn("flex-1 flex flex-col", noteSidebarOpen ? "block" : "hidden md:block")}>
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

            <div className="py-2 border-b border-border">
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent/50 transition-colors",
                  activeCategory === "all" && "bg-accent text-accent-foreground font-medium",
                )}
                onClick={() => setActiveCategory("all")}
              >
                <Home size={16} />
                <span>All Notes</span>
                <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                  {getCategoryCount("all")}
                </span>
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent/50 transition-colors",
                  activeCategory === "favorites" && "bg-accent text-accent-foreground font-medium",
                )}
                onClick={() => setActiveCategory("favorites")}
              >
                <Star size={16} />
                <span>Favorites</span>
                <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                  {getCategoryCount("favorites")}
                </span>
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent/50 transition-colors",
                  activeCategory === "work" && "bg-accent text-accent-foreground font-medium",
                )}
                onClick={() => setActiveCategory("work")}
              >
                <Briefcase size={16} />
                <span>Work</span>
                <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                  {getCategoryCount("work")}
                </span>
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent/50 transition-colors",
                  activeCategory === "personal" && "bg-accent text-accent-foreground font-medium",
                )}
                onClick={() => setActiveCategory("personal")}
              >
                <User size={16} />
                <span>Personal</span>
                <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                  {getCategoryCount("personal")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground font-medium">
              <span>RECENT NOTES</span>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-7 w-24 text-xs border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest</SelectItem>
                  <SelectItem value="date-asc">Oldest</SelectItem>
                  <SelectItem value="alpha">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 overflow-auto">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "p-3 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors",
                    note.id === activeNoteId && "bg-accent border-l-2 border-l-primary",
                  )}
                  onClick={() => {
                    setActiveNoteId(note.id)
                    // On mobile, close the sidebar after selecting a note
                    if (isMobile) {
                      setNoteSidebarOpen(false)
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium truncate mr-2">{note.title}</div>
                    <button
                      className={cn(
                        "p-1 rounded-sm hover:bg-muted transition-colors flex-shrink-0",
                        note.isFavorite && "text-amber-500",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(note.id)
                      }}
                    >
                      <Star size={14} fill={note.isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{note.preview}</div>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="text-muted-foreground">{note.date}</span>
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-sm">
                      {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Note Editor - adjust for mobile */}
        <div className="flex-1 flex flex-col h-full">
          <div className="p-3 md:p-4 border-b border-border flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <input
              type="text"
              className="note-title-input text-lg md:text-xl font-semibold bg-transparent border-none outline-none w-full md:w-1/2"
              defaultValue={activeNote.title}
            />

            <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
              <Select defaultValue={activeNote.category} className="note-category-select w-full md:w-auto">
                <SelectTrigger className="w-full md:w-28 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="ideas">Ideas</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAITools(!showAITools)}
                className={cn(showAITools ? "bg-primary/10" : "", "w-full md:w-auto")}
              >
                <Bold className="mr-2 h-4 w-4" />
                AI Tools
              </Button>

              <Button variant="outline" size="sm" onClick={handleShareNote} className="w-full md:w-auto">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>

              <Button size="sm" onClick={handleSaveNote} className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <div className="p-2 border-b border-border flex items-center flex-wrap gap-1 overflow-x-auto">
            <div className="flex items-center gap-1 mr-2">
              <Button variant="ghost" size="icon" onClick={() => handleFormatClick("bold")}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleFormatClick("italic")}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleFormatClick("underline")}>
                <Underline className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleFormatClick("strikeThrough")}>
                <Strikethrough className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-6 w-px bg-border mx-1"></div>

            <Select defaultValue="p" onValueChange={handleHeadingChange}>
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

            <div className="h-6 w-px bg-border mx-1"></div>

            <div className="flex items-center gap-1 mr-2">
              <Button variant="ghost" size="icon" onClick={() => handleFormatClick("insertUnorderedList")}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleFormatClick("insertOrderedList")}>
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleFormatClick("insertHTML")}>
                <CheckSquare className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-6 w-px bg-border mx-1"></div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const url = prompt("Enter URL:", "https://")
                  if (url) document.execCommand("createLink", false, url)
                }}
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const url = prompt("Enter image URL:", "https://")
                  if (url) document.execCommand("insertImage", false, url)
                }}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const code = prompt("Enter code:")
                  if (code) document.execCommand("insertHTML", false, `<code>${code}</code>`)
                }}
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-auto">
            <div
              className="note-content flex-1 p-4 md:p-6 overflow-auto prose prose-sm max-w-none dark:prose-invert"
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: activeNote.content }}
            />

            {showAITools && (
              <div
                className={cn(
                  "border-l border-border p-4 overflow-y-auto",
                  isMobile ? "w-full absolute inset-0 bg-card z-10" : "w-80",
                )}
              >
                {isMobile && (
                  <Button variant="ghost" size="sm" onClick={() => setShowAITools(false)} className="mb-4">
                    ← Back to Note
                  </Button>
                )}
                <div className="space-y-4">
                  <AITextSummary text={activeNote.content.replace(/<[^>]*>/g, " ")} />

                  <AIWritingAssistant
                    initialText={activeNote.content.replace(/<[^>]*>/g, " ")}
                    onApplyText={handleApplyImprovedText}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

