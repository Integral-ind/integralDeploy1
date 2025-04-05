"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  title: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  deadline: string
  progress: number
}

export default function Projects() {
  const projects: Project[] = [
    { id: "proj1", title: "Marketing Campaign", status: "in-progress", deadline: "April 15, 2025", progress: 65 },
    { id: "proj2", title: "Website Redesign", status: "in-progress", deadline: "April 30, 2025", progress: 40 },
    { id: "proj3", title: "Annual Report", status: "completed", deadline: "March 1, 2025", progress: 100 },
  ]

  const { toast } = useToast()

  const handleViewTasks = (id: string) => {
    toast({
      title: "View Tasks",
      description: `Viewing tasks for project ${id}`,
    })
  }

  const handleEditProject = (id: string) => {
    toast({
      title: "Edit Project",
      description: `Editing project ${id}`,
    })
  }

  const handleAddProject = () => {
    toast({
      title: "Add Project",
      description: "Create a new project",
    })
  }

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "on-hold":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(project.status))}>
                {project.status
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <Calendar className="mr-2 h-4 w-4" />
              Deadline: {project.deadline}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => handleViewTasks(project.id)}>
              View Tasks
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleEditProject(project.id)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Card
        className="flex flex-col items-center justify-center text-center p-6 border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={handleAddProject}
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <div className="font-medium">Add New Project</div>
      </Card>
    </div>
  )
}

