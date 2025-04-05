"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Folder, FileText, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Resource {
  id: string
  title: string
  type: "folder" | "document"
  meta: string
}

export default function Resources() {
  const resources: Resource[] = [
    { id: "res1", title: "Project Documents", type: "folder", meta: "5 items" },
    { id: "res2", title: "Meeting Notes", type: "document", meta: "Last edited Mar 1" },
    { id: "res3", title: "Marketing Assets", type: "folder", meta: "12 items" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}

      <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div className="font-medium">Add New Resource</div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ResourceCardProps {
  resource: Resource
}

function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6 flex items-start">
        <div
          className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center mr-3 flex-shrink-0",
            resource.type === "folder"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          )}
        >
          {resource.type === "folder" ? <Folder className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
        </div>
        <div>
          <div className="font-medium">{resource.title}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {resource.type === "folder" ? "Folder" : "Document"} • {resource.meta}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

