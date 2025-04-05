// Create a new context file to manage task state globally

"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Task {
  id: string
  text: string
  completed: boolean
  dueDate?: string
  priority?: "low" | "medium" | "high"
  category: string
  addedToCalendar?: boolean
  completedDate?: string
}

interface TaskContextType {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  addTask: (task: Omit<Task, "id" | "completedDate">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  getTaskStats: () => {
    activeTasks: number
    completedToday: number
    tasksAssigned: number
    tasksReceived: number
  }
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task1",
      text: "Prepare for client meeting",
      completed: false,
      dueDate: "2025-03-15",
      priority: "high",
      category: "pending",
      addedToCalendar: true,
    },
    {
      id: "task2",
      text: "Send meeting agenda to team",
      completed: true,
      dueDate: "2025-03-10",
      priority: "medium",
      category: "pending",
      addedToCalendar: true,
      completedDate: new Date().toISOString().split("T")[0], // Today
    },
    {
      id: "task3",
      text: "Review marketing materials from Sarah",
      completed: false,
      dueDate: "2025-03-18",
      priority: "medium",
      category: "received",
      addedToCalendar: true,
    },
    {
      id: "task4",
      text: "David - Financial report analysis",
      completed: false,
      dueDate: "2025-03-25",
      priority: "high",
      category: "assigned",
      addedToCalendar: true,
    },
    {
      id: "task5",
      text: "Update project timeline",
      completed: true,
      dueDate: "2025-03-12",
      priority: "medium",
      category: "pending",
      completedDate: new Date().toISOString().split("T")[0], // Today
    },
    {
      id: "task6",
      text: "Review quarterly goals",
      completed: true,
      dueDate: "2025-03-05",
      priority: "low",
      category: "pending",
      completedDate: "2025-03-05", // Not today
    },
    {
      id: "task7",
      text: "Prepare sales presentation",
      completed: false,
      dueDate: "2025-03-20",
      priority: "high",
      category: "pending",
    },
    {
      id: "task8",
      text: "Team performance reviews",
      completed: false,
      dueDate: "2025-03-28",
      priority: "medium",
      category: "assigned",
    },
    {
      id: "task9",
      text: "Client feedback implementation",
      completed: false,
      dueDate: "2025-03-22",
      priority: "high",
      category: "received",
    },
    {
      id: "task10",
      text: "Update website content",
      completed: false,
      dueDate: "2025-03-17",
      priority: "medium",
      category: "received",
    },
  ])

  const { toast } = useToast()

  // Load tasks from localStorage on initial load
  useEffect(() => {
    const storedTasks = localStorage.getItem("integral_tasks")
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks))
      } catch (error) {
        console.error("Failed to parse stored tasks:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("integral_tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (task: Omit<Task, "id" | "completedDate">) => {
    const newTask: Task = {
      ...task,
      id: `task${Date.now()}`,
    }
    setTasks((prevTasks) => [newTask, ...prevTasks])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const completed = !task.completed
          return {
            ...task,
            completed,
            completedDate: completed ? new Date().toISOString().split("T")[0] : undefined,
          }
        }
        return task
      }),
    )
  }

  const getTaskStats = () => {
    const today = new Date().toISOString().split("T")[0]

    const activeTasks = tasks.filter((task) => !task.completed).length
    const completedToday = tasks.filter((task) => task.completed && task.completedDate === today).length
    const tasksAssigned = tasks.filter((task) => task.category === "assigned").length
    const tasksReceived = tasks.filter((task) => task.category === "received").length

    return {
      activeTasks,
      completedToday,
      tasksAssigned,
      tasksReceived,
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTaskStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}

