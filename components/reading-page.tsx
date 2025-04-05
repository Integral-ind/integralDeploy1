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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, BookOpen, LinkIcon, CheckCircle } from "lucide-react"

interface ReadingItem {
  id: string
  title: string
  url: string
  type: "article" | "book" | "paper" | "other"
  notes: string
  completed: boolean
  date: string
}

export default function ReadingList() {
  const [readingItems, setReadingItems] = useState<ReadingItem[]>([])
  const [newItem, setNewItem] = useState<Omit<ReadingItem, "id" | "date" | "completed">>({
    title: "",
    url: "",
    type: "article",
    notes: "",
  })
  const [open, setOpen] = useState(false)
  const [showCompleted, setShowCompleted] = useState(true)

  const handleAddItem = () => {
    if (!newItem.title || !newItem.url) return

    const item: ReadingItem = {
      id: crypto.randomUUID(),
      title: newItem.title,
      url: newItem.url,
      type: newItem.type,
      notes: newItem.notes,
      completed: false,
      date: new Date().toISOString(),
    }

    setReadingItems([...readingItems, item])
    setNewItem({ title: "", url: "", type: "article", notes: "" })
    setOpen(false)
  }

  const handleDeleteItem = (id: string) => {
    setReadingItems(readingItems.filter((item) => item.id !== id))
  }

  const handleToggleCompleted = (id: string) => {
    setReadingItems(readingItems.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const filteredItems = readingItems.filter((item) => showCompleted || !item.completed)

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reading List</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Reading Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Reading Item</DialogTitle>
              <DialogDescription>Add a new article, book, or paper to your reading list.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Title of the reading item"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL or Reference</Label>
                <Input
                  id="url"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  placeholder="URL or reference"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value: "article" | "book" | "paper" | "other") =>
                    setNewItem({ ...newItem, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="paper">Paper</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="Your notes about this item"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="show-completed"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="show-completed">Show completed items</Label>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">No reading items yet</h3>
          <p className="text-muted-foreground mt-1">Add a new reading item to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className={item.completed ? "opacity-70" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {item.type === "book" ? (
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    ) : (
                      <LinkIcon className="h-4 w-4 mr-2 text-primary" />
                    )}
                    <span className="text-xs font-medium uppercase">{item.type}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <CardTitle className={`mt-2 ${item.completed ? "line-through" : ""}`}>{item.title}</CardTitle>
                <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center"
                  >
                    <LinkIcon className="h-3 w-3 mr-1" />
                    {item.url.length > 40 ? `${item.url.substring(0, 40)}...` : item.url}
                  </a>
                </p>
                {item.notes && <p className="text-sm mt-2">{item.notes}</p>}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    Open Link
                  </a>
                </Button>
                <Button
                  variant={item.completed ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleCompleted(item.id)}
                  className="flex items-center"
                >
                  {item.completed ? (
                    <>Reopen</>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

