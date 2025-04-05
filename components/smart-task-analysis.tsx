"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Loader2 } from "lucide-react"
import { useTasks } from "@/lib/task-context"
import { generateAIResponse } from "@/lib/ai-service"
import { useToast } from "@/hooks/use-toast"

export function SmartTaskAnalysis() {
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const { tasks } = useTasks()
  const { toast } = useToast()

  const performAnalysis = async () => {
    if (tasks.length < 5) {
      toast({
        title: "Not Enough Data",
        description: "You need at least 5 tasks for a meaningful analysis",
      })
      return
    }

    setLoading(true)

    try {
      // Format task data for analysis
      const taskData = tasks.map((task) => ({
        text: task.text,
        completed: task.completed,
        priority: task.priority || "none",
        dueDate: task.dueDate || "unspecified",
        category: task.category,
      }))

      const prompt = `
        Analyze the following task data and provide insights on:
        1. Productivity patterns
        2. Task completion rates
        3. Priority distribution
        4. One actionable suggestion for improvement
        
        Task data:
        ${JSON.stringify(taskData, null, 2)}
        
        Respond with a concise analysis in 3-4 paragraphs.
      `

      const result = await generateAIResponse(prompt)
      setAnalysis(result)

      toast({
        title: "Analysis Complete",
        description: "Your tasks have been analyzed successfully",
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not complete the task analysis",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          Smart Task Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : analysis ? (
          <div className="space-y-3">
            <div className="whitespace-pre-wrap text-sm">{analysis}</div>
            <Button variant="outline" size="sm" onClick={performAnalysis} className="mt-4">
              Refresh Analysis
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Get AI-powered insights about your task patterns, completion rates, and suggestions for improvement.
            </p>
            <Button onClick={performAnalysis} disabled={loading || tasks.length < 5} className="w-full">
              Analyze My Tasks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

