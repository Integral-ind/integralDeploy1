"use client"

import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { useState, useCallback } from "react"

// Rate limiting implementation
let lastApiCallTimestamp = 0
const MIN_API_CALL_INTERVAL = 2000 // 2 seconds between calls

/**
 * Generate text using the AI model
 */
export async function generateAIResponse(prompt: string, systemPrompt?: string, maxTokens = 500): Promise<string> {
  try {
    // Rate limiting check
    const now = Date.now()
    const timeSinceLastCall = now - lastApiCallTimestamp

    if (timeSinceLastCall < MIN_API_CALL_INTERVAL) {
      await new Promise((resolve) => setTimeout(resolve, MIN_API_CALL_INTERVAL - timeSinceLastCall))
    }

    lastApiCallTimestamp = Date.now()

    // Use default system prompt if none provided
    const system = systemPrompt || "You are a helpful AI assistant for a productivity and task management application."

    // Generate response
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      system,
      prompt,
      maxTokens,
    })

    return text
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw new Error("Failed to generate AI response. Please try again later.")
  }
}

/**
 * Custom hook for streaming AI responses with loading state management
 */
export function useAIStream() {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)

  const streamAIResponse = useCallback(async (prompt: string, systemPrompt?: string) => {
    try {
      setIsLoading(true)
      setContent("")
      setError(null)

      // Use default system prompt if none provided
      const system =
        systemPrompt || "You are a helpful AI assistant for a productivity and task management application."

      const result = streamText({
        model: openai("gpt-3.5-turbo"),
        system,
        prompt,
        onChunk: ({ chunk }) => {
          if (chunk.type === "text-delta") {
            setContent((prev) => prev + chunk.text)
          }
        },
      })

      await result.text
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Error streaming AI response:", error)
      setError("Failed to stream AI response. Please try again later.")
      setIsLoading(false)
      return false
    }
  }, [])

  return {
    streamAIResponse,
    isLoading,
    content,
    error,
    reset: () => {
      setContent("")
      setError(null)
    },
  }
}

/**
 * Generate task recommendations based on existing tasks
 */
export async function generateTaskRecommendations(existingTasks: any[]): Promise<string[]> {
  try {
    // Format existing tasks for the prompt
    const tasksText = existingTasks
      .slice(0, 10) // Limit to prevent token overflow
      .map((task) => `- ${task.text} (${task.completed ? "Completed" : "Pending"})`)
      .join("\n")

    const prompt = `
      Based on the following list of tasks, suggest 3-5 related tasks that might be helpful for the user to consider adding to their task list. For each suggestion, provide a clear, concise task title that would fit well in a task management system.

      Current tasks:
      ${tasksText}

      Respond with only the task suggestions, one per line, without numbers or bullet points.
    `

    const response = await generateAIResponse(prompt)

    // Parse the response into individual task suggestions
    return response
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  } catch (error) {
    console.error("Error generating task recommendations:", error)
    return []
  }
}

/**
 * Generate summary of text content
 */
export async function generateTextSummary(content: string, maxLength = 150): Promise<string> {
  try {
    if (!content || content.trim().length < 200) {
      return content // Don't summarize short text
    }

    const prompt = `
      Summarize the following content in a concise way, focusing on the key points.
      The summary should be no longer than ${maxLength} characters.

      Content:
      ${content}
    `

    return await generateAIResponse(prompt)
  } catch (error) {
    console.error("Error generating text summary:", error)
    return content.substring(0, maxLength) + "..."
  }
}

/**
 * Generate a smart reminder suggestion based on a task
 */
export async function generateReminderSuggestion(task: any): Promise<string> {
  try {
    const prompt = `
      Based on this task, suggest a smart time for a reminder. Consider the task's priority, deadline, and type.
      Task: ${task.text}
      Priority: ${task.priority || "not specified"}
      Deadline: ${task.dueDate || "not specified"}

      Reply with only a brief, helpful suggestion for when to set a reminder, in a conversational tone.
    `

    return await generateAIResponse(prompt, undefined, 100)
  } catch (error) {
    console.error("Error generating reminder suggestion:", error)
    return "Consider setting a reminder before the deadline"
  }
}

