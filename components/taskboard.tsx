"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Trash2, ChevronDown, ChevronRight, Pencil, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useTasks, type Task } from "@/lib/task-context"
import { AIReminderSuggestion } from "@/components/ai-reminder-suggestion"
import { AITaskRecommendations } from "@/components/ai-task-recommendations"
import { SmartTaskAnalysis } from "@/components/smart-task-analysis"

export default function Taskboard() {
  const { tasks, setTasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks()

  const [newTask, setNewTask] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState("pending")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"none" | "low" | "medium" | "high">("none")
  const [addToCalendar, setAddToCalendar] = useState(false)
  const [showTaskOptions, setShowTaskOptions] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "my-tasks": true,
    pending: true,
    received: true,
    "assigned-tasks": true,
    assigned: true,
  })
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "high" | "medium" | "low">("all")
  const [showReminderSuggestion, setShowReminderSuggestion] = useState<string | null>(null)

  const { toast } = useToast()

  // Add these new state variables to the existing state declarations at the top of the component
  const [addingTaskToCategory, setAddingTaskToCategory] = useState<string | null>(null)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<{
    text: string
    dueDate?: string
    priority?: "low" | "medium" | "high" | "none"
    addedToCalendar: boolean
  }>({
    text: "",
    dueDate: "",
    priority: "none",
    addedToCalendar: false,
  })

  // Add this new function to handle starting task addition for a specific category
  const handleStartAddTask = (category: string) => {
    setAddingTaskToCategory(category)
    setNewTaskCategory(category)
    setNewTask("")
    setNewTaskDueDate("")
    setNewTaskPriority("none")
    setAddToCalendar(false)
  }

  // Add this new function to handle canceling task addition
  const handleCancelAddTask = () => {
    setAddingTaskToCategory(null)
  }

  // Add this new function to handle adding a task from the inline form
  const handleAddTaskInline = () => {
    if (!newTask.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task",
        variant: "destructive",
      })
      return
    }

    const newTaskObj: Omit<Task, "id" | "completedDate"> = {
      text: newTask,
      completed: false,
      category: newTaskCategory,
      ...(newTaskDueDate && { dueDate: newTaskDueDate }),
      ...(newTaskPriority !== "none" && { priority: newTaskPriority as "low" | "medium" | "high" }),
      addedToCalendar: addToCalendar,
    }

    addTask(newTaskObj)

    // If add to calendar is checked, add task to calendar
    if (addToCalendar && newTaskDueDate) {
      toast({
        title: "Added to Calendar",
        description: `Task "${newTask}" added to calendar on ${new Date(newTaskDueDate).toLocaleDateString()}`,
      })
    }

    // Reset form
    setNewTask("")
    setNewTaskDueDate("")
    setNewTaskPriority("none")
    setAddToCalendar(false)
    setAddingTaskToCategory(null)

    toast({
      title: "Task added",
      description: "New task has been added successfully",
    })
  }

  // Add these new functions to handle task editing
  const handleStartEditTask = (task: Task) => {
    setEditingTaskId(task.id)
    setEditFormData({
      text: task.text,
      dueDate: task.dueDate || "",
      priority: task.priority || "none",
      addedToCalendar: task.addedToCalendar || false,
    })
  }

  const handleCancelEditTask = () => {
    setEditingTaskId(null)
  }

  const handleSaveEditTask = (taskId: string) => {
    if (!editFormData.text.trim()) {
      toast({
        title: "Error",
        description: "Task text cannot be empty",
        variant: "destructive",
      })
      return
    }

    updateTask(taskId, {
      text: editFormData.text,
      dueDate: editFormData.dueDate || undefined,
      priority: editFormData.priority !== "none" ? (editFormData.priority as "low" | "medium" | "high") : undefined,
      addedToCalendar: editFormData.addedToCalendar,
    })

    setEditingTaskId(null)

    toast({
      title: "Task updated",
      description: "Task has been updated successfully",
    })
  }

  const handleReminderSuggestion = (taskId: string) => {
    setShowReminderSuggestion(showReminderSuggestion === taskId ? null : taskId)
  }

  const handleApplyReminderSuggestion = (taskId: string, suggestion: string) => {
    // In a real app, this would parse the suggestion and set a reminder
    // For demo, we'll just update the task description
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      updateTask(taskId, {
        text: `${task.text} (Reminder: ${suggestion})`,
      })

      setShowReminderSuggestion(null)
    }
  }

  // Replace the handleAddCategory function with this improved version
  const handleAddCategory = () => {
    // Simple implementation - prompt for category name
    const categoryName = prompt("Enter new category name:")
    if (!categoryName || categoryName.trim() === "") return

    const categoryId = categoryName.toLowerCase().replace(/\s+/g, "-")

    // Update expanded categories state
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: true,
      [`${categoryId}-items`]: true,
    })

    toast({
      title: "Category Added",
      description: `Category "${categoryName}" has been added`,
    })
  }

  const handleTaskToggle = (taskId: string) => {
    toggleTaskCompletion(taskId)

    const task = tasks.find((t) => t.id === taskId)

    // Notify about task status change
    toast({
      title: !task?.completed ? "Task Completed" : "Task Marked as Pending",
      description: task?.text,
    })

    // If task is added to calendar, update calendar event
    if (task?.addedToCalendar) {
      // In a real app, this would update the calendar event
      // For demo purposes, we'll just show a toast
      toast({
        title: "Calendar Updated",
        description: `Task "${task.text}" ${!task.completed ? "completed" : "pending"} status synced to calendar`,
      })
    }
  }

  const handleTaskDelete = (taskId: string) => {
    const taskToDelete = tasks.find((task) => task.id === taskId)

    deleteTask(taskId)

    toast({
      title: "Task deleted",
      description: "The task has been removed",
    })

    // If task was added to calendar, remove from calendar
    if (taskToDelete?.addedToCalendar) {
      // In a real app, this would remove the task from the calendar
      // For demo purposes, we'll just show a toast
      toast({
        title: "Calendar Updated",
        description: `Task "${taskToDelete.text}" removed from calendar`,
      })
    }
  }

  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task",
        variant: "destructive",
      })
      return
    }

    const newTaskObj: Omit<Task, "id" | "completedDate"> = {
      text: newTask,
      completed: false,
      category: newTaskCategory,
      ...(newTaskDueDate && { dueDate: newTaskDueDate }),
      ...(newTaskPriority !== "none" && { priority: newTaskPriority as "low" | "medium" | "high" }),
      addedToCalendar: addToCalendar,
    }

    addTask(newTaskObj)

    // If add to calendar is checked, add task to calendar
    if (addToCalendar && newTaskDueDate) {
      // In a real app, this would add the task to the calendar
      // For demo purposes, we'll just show a toast
      toast({
        title: "Added to Calendar",
        description: `Task "${newTask}" added to calendar on ${new Date(newTaskDueDate).toLocaleDateString()}`,
      })
    }

    // Reset form
    setNewTask("")
    setNewTaskDueDate("")
    setNewTaskPriority("none")
    setAddToCalendar(false)
    setShowTaskOptions(false)

    toast({
      title: "Task added",
      description: "New task has been added successfully",
    })
  }

  const toggleCategoryExpand = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleViewInCalendar = (task: Task) => {
    if (!task.dueDate) {
      toast({
        title: "No Due Date",
        description: "This task doesn't have a due date to view in the calendar",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would navigate to the calendar view and highlight the task
    // For demo purposes, we'll just show a toast
    toast({
      title: "View in Calendar",
      description: `Viewing task "${task.text}" in calendar on ${new Date(task.dueDate).toLocaleDateString()}`,
    })

    // If task is not added to calendar, ask if user wants to add it
    if (!task.addedToCalendar) {
      const addToCalendar = window.confirm(
        `Task "${task.text}" is not added to the calendar. Would you like to add it?`,
      )

      if (addToCalendar) {
        updateTask(task.id, { addedToCalendar: true })

        toast({
          title: "Added to Calendar",
          description: `Task "${task.text}" added to calendar on ${new Date(task.dueDate).toLocaleDateString()}`,
        })
      }
    }
  }

  const handleFilterChange = (newFilter: "all" | "completed" | "pending" | "high" | "medium" | "low") => {
    setFilter(newFilter)

    toast({
      title: "Filter Applied",
      description: `Showing ${newFilter} tasks`,
    })
  }

  // Filter tasks based on current filter
  const getFilteredTasks = (categoryTasks: Task[]) => {
    switch (filter) {
      case "completed":
        return categoryTasks.filter((task) => task.completed)
      case "pending":
        return categoryTasks.filter((task) => !task.completed)
      case "high":
        return categoryTasks.filter((task) => task.priority === "high")
      case "medium":
        return categoryTasks.filter((task) => task.priority === "medium")
      case "low":
        return categoryTasks.filter((task) => task.priority === "low")
      default:
        return categoryTasks
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(value: any) => handleFilterChange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <TaskCategory
            title="My Tasks"
            category="my-tasks"
            expanded={expandedCategories["my-tasks"]}
            onToggleExpand={() => toggleCategoryExpand("my-tasks")}
            onAddTask={handleStartAddTask}
          >
            {expandedCategories["my-tasks"] && (
              <>
                <TaskSubcategory
                  title="Pending"
                  category="pending"
                  expanded={expandedCategories["pending"]}
                  onToggleExpand={() => toggleCategoryExpand("pending")}
                  onAddTask={handleStartAddTask}
                >
                  {expandedCategories["pending"] && (
                    <div className="space-y-2">
                      {getFilteredTasks(tasks.filter((task) => task.category === "pending")).map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={() => handleTaskToggle(task.id)}
                          onDelete={() => handleTaskDelete(task.id)}
                          onViewInCalendar={() => handleViewInCalendar(task)}
                          onEdit={handleStartEditTask}
                          onReminderSuggestion={() => handleReminderSuggestion(task.id)}
                          showReminderSuggestion={showReminderSuggestion === task.id}
                          onApplyReminderSuggestion={(suggestion) => handleApplyReminderSuggestion(task.id, suggestion)}
                          isEditing={editingTaskId === task.id}
                          editFormData={editFormData}
                          onEditFormChange={(field, value) => setEditFormData({ ...editFormData, [field]: value })}
                          onSaveEdit={() => handleSaveEditTask(task.id)}
                          onCancelEdit={handleCancelEditTask}
                        />
                      ))}

                      {addingTaskToCategory === "pending" && (
                        <div className="p-3 bg-card rounded-md border border-border shadow-sm">
                          <Input
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="mb-3"
                            autoFocus
                          />

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <Label htmlFor="inline-due-date" className="text-xs mb-1 block">
                                Due date
                              </Label>
                              <Input
                                id="inline-due-date"
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                              />
                            </div>

                            <div>
                              <Label htmlFor="inline-priority" className="text-xs mb-1 block">
                                Priority
                              </Label>
                              <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
                                <SelectTrigger id="inline-priority">
                                  <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No Priority</SelectItem>
                                  <SelectItem value="low">Low Priority</SelectItem>
                                  <SelectItem value="medium">Medium Priority</SelectItem>
                                  <SelectItem value="high">High Priority</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mb-3">
                            <Checkbox
                              id="inline-add-to-calendar"
                              checked={addToCalendar}
                              onCheckedChange={(checked) => setAddToCalendar(checked as boolean)}
                            />
                            <Label htmlFor="inline-add-to-calendar" className="text-sm">
                              Add to calendar
                            </Label>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={handleCancelAddTask}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleAddTaskInline}>
                              Add Task
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TaskSubcategory>

                <TaskSubcategory
                  title="Tasks Received"
                  category="received"
                  expanded={expandedCategories["received"]}
                  onToggleExpand={() => toggleCategoryExpand("received")}
                  onAddTask={handleStartAddTask}
                >
                  {expandedCategories["received"] && (
                    <div className="space-y-2">
                      {getFilteredTasks(tasks.filter((task) => task.category === "received")).map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={() => handleTaskToggle(task.id)}
                          onDelete={() => handleTaskDelete(task.id)}
                          onViewInCalendar={() => handleViewInCalendar(task)}
                          onEdit={handleStartEditTask}
                          onReminderSuggestion={() => handleReminderSuggestion(task.id)}
                          showReminderSuggestion={showReminderSuggestion === task.id}
                          onApplyReminderSuggestion={(suggestion) => handleApplyReminderSuggestion(task.id, suggestion)}
                          isEditing={editingTaskId === task.id}
                          editFormData={editFormData}
                          onEditFormChange={(field, value) => setEditFormData({ ...editFormData, [field]: value })}
                          onSaveEdit={() => handleSaveEditTask(task.id)}
                          onCancelEdit={handleCancelEditTask}
                        />
                      ))}

                      {addingTaskToCategory === "received" && (
                        <div className="p-3 bg-card rounded-md border border-border shadow-sm">
                          <Input
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="mb-3"
                            autoFocus
                          />

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <Label htmlFor="inline-due-date-received" className="text-xs mb-1 block">
                                Due date
                              </Label>
                              <Input
                                id="inline-due-date-received"
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                              />
                            </div>

                            <div>
                              <Label htmlFor="inline-priority-received" className="text-xs mb-1 block">
                                Priority
                              </Label>
                              <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
                                <SelectTrigger id="inline-priority-received">
                                  <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No Priority</SelectItem>
                                  <SelectItem value="low">Low Priority</SelectItem>
                                  <SelectItem value="medium">Medium Priority</SelectItem>
                                  <SelectItem value="high">High Priority</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mb-3">
                            <Checkbox
                              id="inline-add-to-calendar-received"
                              checked={addToCalendar}
                              onCheckedChange={(checked) => setAddToCalendar(checked as boolean)}
                            />
                            <Label htmlFor="inline-add-to-calendar-received" className="text-sm">
                              Add to calendar
                            </Label>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={handleCancelAddTask}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleAddTaskInline}>
                              Add Task
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TaskSubcategory>
              </>
            )}
          </TaskCategory>

          <TaskCategory
            title="Tasks Assigned"
            category="assigned-tasks"
            expanded={expandedCategories["assigned-tasks"]}
            onToggleExpand={() => toggleCategoryExpand("assigned-tasks")}
            onAddTask={handleStartAddTask}
          >
            {expandedCategories["assigned-tasks"] && (
              <TaskSubcategory
                title="Team Members"
                category="assigned"
                expanded={expandedCategories["assigned"]}
                onToggleExpand={() => toggleCategoryExpand("assigned")}
                onAddTask={handleStartAddTask}
              >
                {expandedCategories["assigned"] && (
                  <div className="space-y-2">
                    {getFilteredTasks(tasks.filter((task) => task.category === "assigned")).map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => handleTaskToggle(task.id)}
                        onDelete={() => handleTaskDelete(task.id)}
                        onViewInCalendar={() => handleViewInCalendar(task)}
                        onEdit={handleStartEditTask}
                        onReminderSuggestion={() => handleReminderSuggestion(task.id)}
                        showReminderSuggestion={showReminderSuggestion === task.id}
                        onApplyReminderSuggestion={(suggestion) => handleApplyReminderSuggestion(task.id, suggestion)}
                        isEditing={editingTaskId === task.id}
                        editFormData={editFormData}
                        onEditFormChange={(field, value) => setEditFormData({ ...editFormData, [field]: value })}
                        onSaveEdit={() => handleSaveEditTask(task.id)}
                        onCancelEdit={handleCancelEditTask}
                      />
                    ))}

                    {addingTaskToCategory === "assigned" && (
                      <div className="p-3 bg-card rounded-md border border-border shadow-sm">
                        <Input
                          placeholder="Add a new task..."
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          className="mb-3"
                          autoFocus
                        />

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <Label htmlFor="inline-due-date-assigned" className="text-xs mb-1 block">
                              Due date
                            </Label>
                            <Input
                              id="inline-due-date-assigned"
                              type="date"
                              value={newTaskDueDate}
                              onChange={(e) => setNewTaskDueDate(e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor="inline-priority-assigned" className="text-xs mb-1 block">
                              Priority
                            </Label>
                            <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
                              <SelectTrigger id="inline-priority-assigned">
                                <SelectValue placeholder="Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Priority</SelectItem>
                                <SelectItem value="low">Low Priority</SelectItem>
                                <SelectItem value="medium">Medium Priority</SelectItem>
                                <SelectItem value="high">High Priority</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          <Checkbox
                            id="inline-add-to-calendar-assigned"
                            checked={addToCalendar}
                            onCheckedChange={(checked) => setAddToCalendar(checked as boolean)}
                          />
                          <Label htmlFor="inline-add-to-calendar-assigned" className="text-sm">
                            Add to calendar
                          </Label>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={handleCancelAddTask}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleAddTaskInline}>
                            Add Task
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TaskSubcategory>
            )}
          </TaskCategory>

          <Button variant="outline" className="w-full py-6 border-dashed" onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Category
          </Button>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col space-y-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onFocus={() => setShowTaskOptions(true)}
                />

                <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">My Tasks - Pending</SelectItem>
                    <SelectItem value="received">My Tasks - Received</SelectItem>
                    <SelectItem value="assigned">Tasks Assigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showTaskOptions && (
                <div className="space-y-4 pt-2 border-t border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taskDueDate">Due date</Label>
                      <Input
                        id="taskDueDate"
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="taskPriority">Priority</Label>
                      <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
                        <SelectTrigger id="taskPriority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="taskAddToCalendar"
                      checked={addToCalendar}
                      onCheckedChange={(checked) => setAddToCalendar(checked as boolean)}
                    />
                    <Label htmlFor="taskAddToCalendar">Add to calendar</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowTaskOptions(false)
                        setNewTask("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddTask}>Add Task</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <AITaskRecommendations />
          <SmartTaskAnalysis />
        </div>
      </div>
    </div>
  )
}

// Update the TaskCategory component props to include the new functions
interface TaskCategoryProps {
  title: string
  category: string
  expanded: boolean
  onToggleExpand: () => void
  onAddTask: (category: string) => void
  children: React.ReactNode
}

// Replace the TaskCategory function with this updated version
function TaskCategory({ title, category, expanded, onToggleExpand, onAddTask, children }: TaskCategoryProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <button
            onClick={onToggleExpand}
            className="mr-2 focus:outline-none"
            aria-label={expanded ? "Collapse category" : "Expand category"}
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {title}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => onAddTask(category)}>
          <Plus size={16} className="mr-1" />
          Add Task
        </Button>
      </div>
      {children}
    </div>
  )
}

// Update the TaskSubcategory component props to include the new functions
interface TaskSubcategoryProps {
  title: string
  category: string
  expanded: boolean
  onToggleExpand: () => void
  onAddTask: (category: string) => void
  children: React.ReactNode
}

// Replace the TaskSubcategory function with this updated version
function TaskSubcategory({ title, category, expanded, onToggleExpand, onAddTask, children }: TaskSubcategoryProps) {
  return (
    <div className="ml-6 space-y-2 mb-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <h3 className="text-sm font-medium flex items-center">
          <button
            onClick={onToggleExpand}
            className="mr-2 focus:outline-none"
            aria-label={expanded ? "Collapse subcategory" : "Expand subcategory"}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {title}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => onAddTask(category)}>
          <Plus size={14} className="mr-1" />
          Add Task
        </Button>
      </div>
      {children}
    </div>
  )
}

// Update the TaskItem component props to include the new functions
interface TaskItemProps {
  task: Task
  onToggle: () => void
  onDelete: () => void
  onViewInCalendar: () => void
  onEdit: (task: Task) => void
  onReminderSuggestion?: () => void
  showReminderSuggestion?: boolean
  onApplyReminderSuggestion?: (suggestion: string) => void
  isEditing: boolean
  editFormData?: {
    text: string
    dueDate?: string
    priority?: "low" | "medium" | "high" | "none"
    addedToCalendar: boolean
  }
  onEditFormChange?: (field: string, value: any) => void
  onSaveEdit?: () => void
  onCancelEdit?: () => void
}

// Replace the TaskItem function with this updated version
function TaskItem({
  task,
  onToggle,
  onDelete,
  onViewInCalendar,
  onEdit,
  onReminderSuggestion,
  showReminderSuggestion,
  onApplyReminderSuggestion,
  isEditing,
  editFormData,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
}: TaskItemProps) {
  if (isEditing && editFormData) {
    return (
      <div className="flex flex-col p-3 bg-card rounded-md border border-border shadow-sm">
        <Input
          value={editFormData.text}
          onChange={(e) => onEditFormChange?.("text", e.target.value)}
          className="mb-3"
          placeholder="Task description"
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor={`edit-due-date-${task.id}`} className="text-xs mb-1 block">
              Due date
            </Label>
            <Input
              id={`edit-due-date-${task.id}`}
              type="date"
              value={editFormData.dueDate}
              onChange={(e) => onEditFormChange?.("dueDate", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor={`edit-priority-${task.id}`} className="text-xs mb-1 block">
              Priority
            </Label>
            <Select value={editFormData.priority} onValueChange={(value: any) => onEditFormChange?.("priority", value)}>
              <SelectTrigger id={`edit-priority-${task.id}`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <Checkbox
            id={`edit-calendar-${task.id}`}
            checked={editFormData.addedToCalendar}
            onCheckedChange={(checked) => onEditFormChange?.("addedToCalendar", checked as boolean)}
          />
          <Label htmlFor={`edit-calendar-${task.id}`} className="text-sm">
            Add to calendar
          </Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onCancelEdit}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSaveEdit}>
            Save
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-3 bg-card rounded-md border border-border shadow-sm">
      <div className="flex items-start">
        <Checkbox id={task.id} checked={task.completed} onCheckedChange={onToggle} className="mt-1" />
        <div className="ml-3 flex-1">
          <Label
            htmlFor={task.id}
            className={cn(
              "font-medium block mb-1 cursor-pointer",
              task.completed && "line-through text-muted-foreground",
            )}
          >
            {task.text}
          </Label>
          <div className="flex flex-wrap gap-2 text-xs">
            {task.dueDate && (
              <span className="text-muted-foreground">
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {task.priority && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  task.priority === "high" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                  task.priority === "medium" && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                  task.priority === "low" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                )}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            )}
            {task.addedToCalendar && <span className="text-blue-600 dark:text-blue-400">In Calendar</span>}
          </div>
        </div>
        <div className="flex space-x-1">
          {onReminderSuggestion && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onReminderSuggestion}>
              <Sparkles size={16} className={showReminderSuggestion ? "text-primary" : ""} />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(task)}>
            <Pencil size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onViewInCalendar}>
            <Calendar size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {showReminderSuggestion && onApplyReminderSuggestion && (
        <div className="mt-2">
          <AIReminderSuggestion task={task} onSuggestionAccepted={onApplyReminderSuggestion} />
        </div>
      )}
    </div>
  )
}

