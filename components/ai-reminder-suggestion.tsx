"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Sparkles, Loader2 } from "lucide-react"
import { generateReminderSuggestion } from "@/lib/ai-service"
import { useToast } from "@/hooks/use-toast"

interface AIReminderSuggestionProps {
  task: any
  onSuggestionAccepted?: (suggestion: string) => void
}

export function AIReminderSuggestion({ task, onSuggestionAccepted }: AIReminderSuggestionProps) {
  const [suggestion, setSuggestion] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateSuggestion = async () => {
    if (!task) return

    setLoading(true)

    try {
      const reminderSuggestion = await generateReminderSuggestion(task)
      setSuggestion(reminderSuggestion)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate reminder suggestion",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptSuggestion = () => {
    if (onSuggestionAccepted && suggestion) {
      onSuggestionAccepted(suggestion)

      toast({
        title: "Suggestion Applied",
        description: "The AI suggestion has been applied to your task",
      })
    }
  }

  return (
    <div className="mt-2">
      {!suggestion ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={generateSuggestion}
          disabled={loading}
          className="h-8 flex items-center text-xs"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-1 h-3 w-3" />
              AI reminder suggestion
            </>
          )}
        </Button>
      ) : (
        <div className="mt-2 space-y-2">
          <div className="flex items-start gap-2 rounded-md bg-primary/5 p-2 text-xs">
            <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
            <div className="flex-1">{suggestion}</div>
          </div>
          <Button variant="outline" size="sm" onClick={handleAcceptSuggestion} className="h-7 text-xs w-full">
            Apply Suggestion
          </Button>
        </div>
      )}
    </div>
  )
}

