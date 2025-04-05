/**
 * Helper utility to get environment variables with fallbacks
 */

// Safely get environment variables with optional fallbacks
export function getEnv(key: string, fallback = ""): string {
  const value = process.env[key] || fallback

  if (!value && fallback === "") {
    console.warn(`Environment variable ${key} is not set and has no fallback.`)
  }

  return value
}

// Check if required environment variables are set
export function validateEnv() {
  const requiredEnvVars = ["OPENAI_API_KEY"]

  const missing = requiredEnvVars.filter((key) => typeof process.env[key] === "undefined")

  if (missing.length > 0) {
    const missingStr = missing.join(", ")
    console.error(`Missing required environment variables: ${missingStr}`)

    if (typeof window !== "undefined") {
      // Only show in development/browser
      console.warn(`Please create a .env.local file with the missing variables: ${missingStr}`)
    }

    return false
  }

  return true
}

// Get AI API key safely
export function getOpenAIKey(): string {
  return getEnv("OPENAI_API_KEY")
}

