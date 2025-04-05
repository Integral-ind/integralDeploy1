"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 2) {
      // Mock search results - in a real app, this would search actual data
      setSearchResults([
        { type: "task", title: "Prepare for client meeting", date: "Mar 15, 2025" },
        { type: "note", title: "Meeting Notes", date: "Mar 10, 2025" },
        { type: "event", title: "Team Standup", date: "Mar 12, 2025" },
      ])
    } else {
      setSearchResults([])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks, notes, events..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
          </div>

          <div className="mt-4 space-y-2">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 rounded-md hover:bg-accent cursor-pointer flex justify-between"
                  onClick={() => onOpenChange(false)}
                >
                  <div>
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground capitalize">{result.type}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{result.date}</div>
                </div>
              ))
            ) : searchQuery.length > 0 ? (
              <div className="p-3 text-center text-muted-foreground">No results found</div>
            ) : (
              <div className="p-3 text-center text-muted-foreground">Type to search...</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

