"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudSun, Wind } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WeatherData {
  location: string
  country: string
  temp: number
  feelsLike: number
  humidity: number
  wind: number
  conditions: string
  description: string
  icon: string
  timestamp: string
}

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check for cached weather data
    const cachedWeather = localStorage.getItem("weatherData")
    const cachedTimestamp = localStorage.getItem("weatherTimestamp")

    if (cachedWeather && cachedTimestamp) {
      const now = new Date().getTime()
      const timestamp = Number.parseInt(cachedTimestamp)

      // If cached data is less than 30 minutes old, use it
      if (now - timestamp < 30 * 60 * 1000) {
        setWeatherData(JSON.parse(cachedWeather))
        setLoading(false)
        return
      }
    }

    // Otherwise get fresh data
    getWeatherData()
  }, [])

  const getWeatherData = async (forceRefresh = false) => {
    setLoading(true)
    setError(null)

    try {
      // Get user's location
      const location = await getUserLocation()

      // Fetch weather data
      const data = await fetchWeatherData(location.latitude, location.longitude)

      // Cache the weather data
      localStorage.setItem("weatherData", JSON.stringify(data))
      localStorage.setItem("weatherTimestamp", new Date().getTime().toString())

      setWeatherData(data)

      if (forceRefresh) {
        toast({
          title: "Weather Updated",
          description: "Latest weather data has been loaded",
        })
      }
    } catch (err) {
      console.error("Weather error:", err)
      setError("Could not retrieve weather data. Please try again.")

      toast({
        title: "Weather Error",
        description: "Could not retrieve weather data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      // Check if we have cached location
      const cachedLocation = localStorage.getItem("userLocation")

      if (cachedLocation && !userLocation) {
        try {
          const parsedLocation = JSON.parse(cachedLocation)
          setUserLocation(parsedLocation)
          return resolve(parsedLocation)
        } catch (e) {
          console.error("Error parsing cached location:", e)
          // Continue to get new location
        }
      }

      if (userLocation) {
        return resolve(userLocation)
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }

            setUserLocation(newLocation)

            // Cache the location
            localStorage.setItem("userLocation", JSON.stringify(newLocation))

            resolve(newLocation)
          },
          (error) => {
            console.error("Geolocation error:", error)

            // Fall back to default location (San Francisco)
            const defaultLocation = { latitude: 37.7749, longitude: -122.4194 }

            toast({
              title: "Location Error",
              description: "Could not get your location. Using default location.",
              variant: "destructive",
            })

            resolve(defaultLocation)
          },
          { timeout: 10000, enableHighAccuracy: true },
        )
      } else {
        // Geolocation not supported
        reject(new Error("Geolocation is not supported by this browser."))
      }
    })
  }

  const fetchWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
    // Use OpenMeteo API which doesn't require an API key
    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`

    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    // Process the weather data
    const weatherCode = data.current.weather_code
    const weatherDescription = getWeatherDescription(weatherCode)
    const weatherIcon = getWeatherIcon(weatherCode)

    // Get location name using reverse geocoding
    let locationName = "Your Location"
    let countryName = ""

    try {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
      )
      const geoData = await geoResponse.json()

      if (geoData.address) {
        const address = geoData.address
        if (address.city) {
          locationName = address.city
        } else if (address.town) {
          locationName = address.town
        } else if (address.village) {
          locationName = address.village
        } else if (address.suburb) {
          locationName = address.suburb
        }

        countryName = address.country || ""
      }
    } catch (error) {
      console.error("Error getting location name:", error)
    }

    return {
      location: locationName,
      country: countryName,
      temp: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      wind: Math.round(data.current.wind_speed_10m * 3.6), // Convert m/s to km/h
      conditions: weatherDescription,
      description: weatherDescription,
      icon: weatherIcon,
      timestamp: new Date().toLocaleString(),
    }
  }

  // Helper function to convert weather codes to descriptions
  const getWeatherDescription = (code: number): string => {
    const weatherCodes: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    }

    return weatherCodes[code] || "Unknown"
  }

  // Helper function to get appropriate weather icon
  const getWeatherIcon = (code: number): string => {
    if (code === 0) return "sun"
    if (code === 1 || code === 2) return "cloud-sun"
    if (code === 3) return "cloud"
    if (code === 45 || code === 48) return "wind"
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "cloud-rain"
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "cloud-snow"
    if ([95, 96, 99].includes(code)) return "cloud-lightning"

    return "cloud"
  }

  // Render the appropriate weather icon
  const renderWeatherIcon = (iconName: string) => {
    const iconSize = 40
    const iconProps = { size: iconSize, className: "text-primary" }

    switch (iconName) {
      case "sun":
        return <Sun {...iconProps} />
      case "cloud-sun":
        return <CloudSun {...iconProps} />
      case "cloud":
        return <Cloud {...iconProps} />
      case "cloud-rain":
        return <CloudRain {...iconProps} />
      case "cloud-snow":
        return <CloudSnow {...iconProps} />
      case "cloud-lightning":
        return <CloudLightning {...iconProps} />
      case "wind":
        return <Wind {...iconProps} />
      default:
        return <Cloud {...iconProps} />
    }
  }

  return (
    <Card>
      <CardContent className="p-4 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => getWeatherData(true)}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-32 py-4">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 py-4">
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => getWeatherData(true)}>
              Try Again
            </Button>
          </div>
        ) : weatherData ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{weatherData.location}</h3>
                {weatherData.country && <p className="text-sm text-muted-foreground">{weatherData.country}</p>}
                <p className="text-xs text-muted-foreground mt-1">{weatherData.timestamp}</p>
              </div>
              <div className="flex flex-col items-center">
                {renderWeatherIcon(weatherData.icon)}
                <span className="text-2xl font-bold mt-1">{weatherData.temp}°C</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Feels Like</span>
                <span className="font-medium">{weatherData.feelsLike}°C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Humidity</span>
                <span className="font-medium">{weatherData.humidity}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Wind</span>
                <span className="font-medium">{weatherData.wind} km/h</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Conditions</span>
                <span className="font-medium">{weatherData.conditions}</span>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

