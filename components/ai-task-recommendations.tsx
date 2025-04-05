"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LightbulbIcon as Bulb, Plus, Loader2 } from "lucide-react"
import { useTasks } from "@/lib/task-context"
import { generateTaskRecommendations } from "@/lib/ai-service"
import { useToast } from "@/hooks/use-toast"

export function AITaskRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { tasks, addTask } = useTasks()
  const { toast } = useToast()

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const suggestions = await generateTaskRecommendations(tasks)
      setRecommendations(suggestions)
    } catch (err) {
      setError("Failed to generate recommendations. Please try again later.")
      toast({
        title: "Error",
        description: "Could not generate task recommendations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = (text: string) => {
    addTask({
      text,
      completed: false,
      category: "pending",
    })

    // Remove from recommendations
    setRecommendations((prev) => prev.filter((t) => t !== text))

    toast({
      title: "Task Added",
      description: "AI-suggested task has been added to your tasks",
    })
  }

  useEffect(() => {
    // Optional: Auto-fetch recommendations on component mount
    // fetchRecommendations()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Bulb className="mr-2 h-5 w-5 text-primary" />
          AI Task Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <span>{rec}</span>
                <Button variant="ghost" size="sm" onClick={() => handleAddTask(rec)} className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-4 text-center text-sm text-muted-foreground">{error}</div>
        ) : (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Get personalized task suggestions based on your current tasks
          </div>
        )}

        <Button variant="outline" className="mt-4 w-full" onClick={fetchRecommendations} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating suggestions...
            </>
          ) : (
            <>Get AI Suggestions</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

