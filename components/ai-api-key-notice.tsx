"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Sparkles, AlertCircle, ExternalLink } from "lucide-react"

export function AIApiKeyNotice() {
  const [apiKeySet, setApiKeySet] = useState(true)

  // Check if API key is set
  useEffect(() => {
    // In a real app, this would be a server call to check if the API key is configured
    // For demo purposes, always show the notice
    setApiKeySet(false)
  }, [])

  if (apiKeySet) return null

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-amber-900 dark:text-amber-300">
          <Sparkles className="mr-2 h-5 w-5" />
          AI Features Available
        </CardTitle>
        <CardDescription className="text-amber-800 dark:text-amber-400">
          Unlock AI-powered features by setting up your API key
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="bg-white dark:bg-background">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription>
            To use AI features in Integral, you need to provide an OpenAI API key. This key will be stored securely in
            your environment variables.
          </AlertDescription>
        </Alert>

        <div className="mt-4 space-y-2 text-sm text-amber-800 dark:text-amber-400">
          <p className="font-medium">To get started:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              Sign up for an OpenAI account at{" "}
              <a
                href="https://platform.openai.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                platform.openai.com
              </a>
            </li>
            <li>Create an API key in your OpenAI dashboard</li>
            <li>
              Add the key to your environment variables as{" "}
              <code className="bg-amber-100 dark:bg-amber-900/30 px-1 py-0.5 rounded">OPENAI_API_KEY</code>
            </li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="border-amber-300 bg-white">
          <ExternalLink className="mr-2 h-4 w-4" />
          Get OpenAI API Key
        </Button>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Sparkles className="mr-2 h-4 w-4" />
          Enable AI Features
        </Button>
      </CardFooter>
    </Card>
  )
}

