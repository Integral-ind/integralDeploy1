"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Facebook, Github } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signup } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signup(name, email, password)
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute w-[40rem] h-[40rem] rounded-full bg-indigo-500 filter blur-[100px] opacity-10 top-[-20rem] right-[-20rem] pointer-events-none"></div>
      <div className="absolute w-[40rem] h-[40rem] rounded-full bg-pink-500 filter blur-[100px] opacity-10 bottom-[-20rem] left-[-20rem] pointer-events-none"></div>

      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-[900px] min-h-[600px] bg-[rgba(10,10,10,0.7)] backdrop-blur-[10px] rounded-3xl shadow-2xl flex overflow-hidden border border-white/5">
        {/* Sidebar */}
        <div className="w-2/5 p-10 relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-pink-500 opacity-20 z-0"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-semibold font-['Poppins']">
                I
              </div>
              <div className="font-['Poppins'] text-2xl font-semibold text-white">Integral</div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
              Join our community
            </h2>
            <p className="text-gray-300 mb-8">
              Create your account and start organizing your work and boosting productivity today.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-indigo-500/10 text-white text-xs">
                  ✓
                </div>
                <span className="text-gray-300 text-sm">Free 14-day trial, no credit card required</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-indigo-500/10 text-white text-xs">
                  ✓
                </div>
                <span className="text-gray-300 text-sm">Unlimited projects during trial</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-indigo-500/10 text-white text-xs">
                  ✓
                </div>
                <span className="text-gray-300 text-sm">Cancel anytime, no questions asked</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Signup Form */}
        <div className="w-3/5 p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-2 text-white">Create your account</h2>
          <p className="text-gray-400 mb-8">Fill in your details to get started with Integral</p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">
                Full Name
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-md text-white text-[15px] focus:border-indigo-500/50 focus:ring focus:ring-indigo-500/20"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-md text-white text-[15px] focus:border-indigo-500/50 focus:ring focus:ring-indigo-500/20"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-md text-white text-[15px] focus:border-indigo-500/50 focus:ring focus:ring-indigo-500/20"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-md text-white text-[15px] focus:border-indigo-500/50 focus:ring focus:ring-indigo-500/20"
                required
              />
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the{" "}
                <a href="#" className="text-indigo-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-500 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 relative overflow-hidden z-10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-500 before:to-pink-500 before:z-[-1] hover:before:opacity-90 hover:translate-y-[-2px] transition-transform"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="px-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-3 rounded-md border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors">
              <Facebook size={20} />
              <span>Facebook</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 rounded-md border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors">
              <Github size={20} />
              <span>GitHub</span>
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-gray-400">
            Already have an account?
            <Link href="/login" className="text-indigo-500 font-medium ml-1 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

