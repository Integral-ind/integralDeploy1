"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import WeatherWidget from "@/components/weather-widget"
import { useTasks } from "@/lib/task-context"
import { AITaskRecommendations } from "@/components/ai-task-recommendations"
import { AIApiKeyNotice } from "@/components/ai-api-key-notice"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardProps {
  user: {
    name: string
  }
}

export default function Dashboard({ user }: DashboardProps) {
  const [loading, setLoading] = useState(true)
  const { tasks, getTaskStats } = useTasks()
  const taskStats = getTaskStats()
  const { isMobile, isTablet } = useMobile()

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  // This ensures the component re-renders when tasks change
  useEffect(() => {
    // This is just to make the component depend on tasks
    console.log("Tasks updated, refreshing dashboard metrics")
  }, [tasks])

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 md:p-6 text-primary-foreground">
        <h2 className="text-xl md:text-2xl font-bold mb-2">{user.name}'s Workdesk</h2>
        <p className="mb-4 opacity-90 text-sm md:text-base">
          Organize your work and boost productivity with your personal workspace.
        </p>
        <Button variant="secondary" className="mt-2">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* AI API Key Notice (only shown if API key is not set) */}
      <AIApiKeyNotice />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <WeatherWidget />

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <StatCard value={taskStats.activeTasks.toString()} label="Active Tasks" />
          <StatCard value={taskStats.completedToday.toString()} label="Completed Today" />
          <StatCard value={taskStats.tasksAssigned.toString()} label="Tasks Assigned" />
          <StatCard value={taskStats.tasksReceived.toString()} label="Tasks Received" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <WidgetCard
          title="Upcoming Tasks"
          items={tasks
            .filter((task) => !task.completed && task.dueDate)
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .slice(0, 2)
            .map((task) => ({
              text: task.text,
              meta: new Date(task.dueDate!).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            }))}
        />

        <WidgetCard
          title="Recent Notes"
          items={[
            { text: "Meeting Notes", meta: "Mar 10" },
            { text: "Weekly Goals", meta: "Mar 7" },
          ]}
        />

        <AITaskRecommendations />
      </div>
    </div>
  )
}

interface StatCardProps {
  value: string
  label: string
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-3 md:p-4 text-center">
        <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
        <div className="text-xs md:text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

interface WidgetCardProps {
  title: string
  items: { text: string; meta?: string }[]
  emptyMessage?: string
}

function WidgetCard({ title, items, emptyMessage }: WidgetCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                <span className="text-sm md:text-base truncate mr-2">{item.text}</span>
                {item.meta && <span className="text-xs text-muted-foreground whitespace-nowrap">{item.meta}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">{emptyMessage || "No items to display"}</div>
        )}
      </CardContent>
    </Card>
  )
}

