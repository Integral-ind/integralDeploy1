"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Check, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type ReadingStatus = "unread" | "in-progress" | "completed"

interface ReadingItem {
  id: string
  title: string
  author: string
  status: ReadingStatus
}

export default function ReadingList() {
  const [items, setItems] = useState<ReadingItem[]>([
    { id: "read1", title: "The Psychology of Productivity", author: "By James Clear", status: "unread" },
    { id: "read2", title: "Building a Second Brain", author: "By Tiago Forte", status: "in-progress" },
    { id: "read3", title: "Deep Work", author: "By Cal Newport", status: "completed" },
  ])

  const [activeFilter, setActiveFilter] = useState<"all" | ReadingStatus>("all")
  const { toast } = useToast()

  const handleStatusChange = (id: string, newStatus: ReadingStatus) => {
    setItems(items.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))

    toast({
      title: "Status Updated",
      description: `Item marked as ${newStatus.replace("-", " ")}`,
    })
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))

    toast({
      title: "Item Removed",
      description: "Item removed from reading list",
    })
  }

  const handleAddNew = () => {
    toast({
      title: "Add New Item",
      description: "Add a new book or article to your reading list",
    })
  }

  const filteredItems = activeFilter === "all" ? items : items.filter((item) => item.status === activeFilter)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Reading List</CardTitle>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("unread")}
            >
              Unread
            </Button>
            <Button
              variant={activeFilter === "in-progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("in-progress")}
            >
              In Progress
            </Button>
            <Button
              variant={activeFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("completed")}
            >
              Completed
            </Button>
          </div>

          <div className="space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-3 border rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full mr-3",
                      item.status === "unread" && "bg-blue-500",
                      item.status === "in-progress" && "bg-amber-500",
                      item.status === "completed" && "bg-green-500",
                    )}
                  />

                  <div className="flex-1">
                    <div
                      className={cn("font-medium", item.status === "completed" && "line-through text-muted-foreground")}
                    >
                      {item.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.author}</div>
                  </div>

                  <div className="flex space-x-1">
                    {item.status !== "unread" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleStatusChange(item.id, "unread")}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    )}

                    {item.status !== "in-progress" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleStatusChange(item.id, "in-progress")}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    )}

                    {item.status !== "completed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleStatusChange(item.id, "completed")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No items found in this category</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

