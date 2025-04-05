"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { generateTextSummary } from "@/lib/ai-service"
import { useToast } from "@/hooks/use-toast"

interface AITextSummaryProps {
  text: string
  maxLength?: number
  onSummaryGenerated?: (summary: string) => void
}

export function AITextSummary({ text, maxLength = 150, onSummaryGenerated }: AITextSummaryProps) {
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateSummary = async () => {
    if (!text || text.trim().length < 100) {
      toast({
        title: "Text Too Short",
        description: "Please provide more text for summarization",
      })
      return
    }

    setLoading(true)

    try {
      const generatedSummary = await generateTextSummary(text, maxLength)
      setSummary(generatedSummary)

      if (onSummaryGenerated) {
        onSummaryGenerated(generatedSummary)
      }

      toast({
        title: "Summary Generated",
        description: "Your text has been summarized successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        {summary ? (
          <div className="space-y-2">
            <div className="text-sm font-medium">AI Summary</div>
            <div className="text-sm">{summary}</div>
            <Button variant="outline" size="sm" onClick={generateSummary} disabled={loading} className="mt-2">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={generateSummary}
            disabled={loading || !text || text.trim().length < 100}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating summary...
              </>
            ) : (
              <>Generate AI Summary</>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

