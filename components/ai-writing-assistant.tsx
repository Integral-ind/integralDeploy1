"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAIStream } from "@/lib/ai-service"
import { EditIcon, Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIWritingAssistantProps {
  initialText?: string
  onApplyText?: (text: string) => void
}

export function AIWritingAssistant({ initialText = "", onApplyText }: AIWritingAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [inputText, setInputText] = useState(initialText)
  const { streamAIResponse, isLoading, content, error, reset } = useAIStream()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    setInputText(initialText)
  }, [initialText])

  const handleRequestImprovement = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please provide some text to improve",
        variant: "destructive",
      })
      return
    }

    reset()
    await streamAIResponse(
      `Improve the following text, making it more professional, clear, and concise while maintaining its original meaning. Text: ${inputText}`,
    )
  }

  const handleApplyText = () => {
    if (onApplyText && content) {
      onApplyText(content)
      toast({
        title: "Text Applied",
        description: "The improved text has been applied",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <EditIcon className="mr-2 h-5 w-5 text-primary" />
          AI Writing Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          ref={textareaRef}
          placeholder="Enter your text here to improve or generate content..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[100px]"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRequestImprovement}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Improving...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Improve Text
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPrompt("Write a professional email")
              textareaRef.current?.focus()
            }}
          >
            Write Email
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPrompt("Write meeting notes")
              textareaRef.current?.focus()
            }}
          >
            Meeting Notes
          </Button>
        </div>

        {prompt && (
          <div className="text-xs text-muted-foreground">
            Try: <span className="font-medium">{prompt}</span>
          </div>
        )}

        {content && (
          <div className="space-y-2 rounded-md border p-3">
            <div className="flex items-center text-sm font-medium">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              AI Improved Version
            </div>
            <div className="whitespace-pre-wrap text-sm">{content}</div>
            <Button size="sm" onClick={handleApplyText}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Apply Text
            </Button>
          </div>
        )}

        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      </CardContent>
    </Card>
  )
}

