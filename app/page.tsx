"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <>
      {/* Header */}
      <header className="fixed w-full bg-black/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4 h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-semibold">
                I
              </div>
              <div className="font-['Poppins'] text-2xl font-semibold text-white">Integral</div>
            </div>
            <nav className="hidden md:flex gap-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white font-medium text-sm relative after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-gradient-to-r after:from-indigo-500 after:to-pink-500 after:transition-all hover:after:w-full"
              >
                Features
              </a>
              <a
                href="#dashboard"
                className="text-gray-300 hover:text-white font-medium text-sm relative after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-gradient-to-r after:from-indigo-500 after:to-pink-500 after:transition-all hover:after:w-full"
              >
                Dashboard
              </a>
              <a
                href="#pricing"
                className="text-gray-300 hover:text-white font-medium text-sm relative after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-gradient-to-r after:from-indigo-500 after:to-pink-500 after:transition-all hover:after:w-full"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-white font-medium text-sm relative after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-gradient-to-r after:from-indigo-500 after:to-pink-500 after:transition-all hover:after:w-full"
              >
                Contact
              </a>
            </nav>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded text-sm font-medium border border-gray-700 text-white hover:bg-white/5 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded text-sm font-medium text-white relative overflow-hidden z-10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-500 before:to-pink-500 before:z-[-1] hover:before:opacity-90 hover:translate-y-[-2px] transition-transform"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-black pt-32 pb-20 relative overflow-hidden">
        <div className="absolute w-[40rem] h-[40rem] rounded-full bg-indigo-500 filter blur-[100px] opacity-10 top-[-20rem] right-[-20rem] pointer-events-none"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full bg-pink-500 filter blur-[100px] opacity-10 bottom-[-20rem] left-[-20rem] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center px-3 py-1.5 bg-indigo-500/10 rounded-full mb-6 text-sm font-medium text-white border border-indigo-500/20">
              ✨ <span className="ml-1">New Features Released</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6 max-w-4xl text-white">
              Transform Your Workflow with{" "}
              <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">Integral</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              The all-in-one workspace for teams to collaborate, manage projects, and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-md text-base font-medium text-white relative overflow-hidden z-10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-500 before:to-pink-500 before:z-[-1] hover:before:opacity-90 hover:translate-y-[-2px] transition-transform"
              >
                Get Started Free
              </Link>
              <button className="px-6 py-3 rounded-md text-base font-medium border border-gray-700 text-white hover:bg-white/5 transition-colors">
                Watch Demo
              </button>
            </div>
            <div className="w-full max-w-4xl animate-[float_6s_ease-in-out_infinite]">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-desk-WswnaGJkdebXjfpctl5vBDeDB1nqxA.png"
                alt="Integral Dashboard"
                className="w-full rounded-2xl shadow-2xl border border-indigo-500/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="bg-black py-16 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center text-xs text-gray-400 uppercase tracking-wider mb-8">
            TRUSTED BY LEADING COMPANIES
          </div>
          <div className="flex flex-wrap justify-center items-center gap-10">
            <div className="text-lg font-medium text-gray-300 opacity-60 hover:opacity-100 transition-opacity">
              Microsoft
            </div>
            <div className="text-lg font-medium text-gray-300 opacity-60 hover:opacity-100 transition-opacity">
              Airbnb
            </div>
            <div className="text-lg font-medium text-gray-300 opacity-60 hover:opacity-100 transition-opacity">
              Spotify
            </div>
            <div className="text-lg font-medium text-gray-300 opacity-60 hover:opacity-100 transition-opacity">
              Slack
            </div>
            <div className="text-lg font-medium text-gray-300 opacity-60 hover:opacity-100 transition-opacity">
              Uber
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-black py-24 relative overflow-hidden">
        <div className="absolute w-[30rem] h-[30rem] rounded-full bg-blue-500 filter blur-[100px] opacity-5 top-[-15rem] right-[-15rem] pointer-events-none"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full bg-teal-500 filter blur-[100px] opacity-5 bottom-[-15rem] left-[-15rem] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-2.5 py-1 bg-indigo-500/10 text-white rounded-md text-sm font-medium mb-4 border border-indigo-500/20">
              Features
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Everything You Need in{" "}
              <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                One Place
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Powerful tools to streamline your workflow and boost team productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                title: "Advanced Analytics",
                description:
                  "Get real-time insights into your team's performance with detailed reports and interactive dashboards.",
                gradient: "from-indigo-500 to-pink-500",
              },
              {
                icon: "🔄",
                title: "Seamless Integration",
                description: "Connect with your favorite tools and services for a unified workflow experience.",
                gradient: "from-blue-500 to-teal-500",
              },
              {
                icon: "📝",
                title: "Task Management",
                description: "Organize tasks, set priorities, and track progress with our intuitive interface.",
                gradient: "from-amber-500 to-red-500",
              },
              {
                icon: "👥",
                title: "Team Collaboration",
                description: "Work together seamlessly with real-time editing, comments, and notifications.",
                gradient: "from-teal-500 to-blue-500",
              },
              {
                icon: "🔒",
                title: "Enterprise Security",
                description: "Keep your data safe with advanced security features and compliance standards.",
                gradient: "from-pink-500 to-purple-500",
              },
              {
                icon: "📱",
                title: "Mobile Access",
                description: "Access your workspace from anywhere with our mobile apps for iOS and Android.",
                gradient: "from-indigo-500 to-pink-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/[0.02] rounded-2xl p-8 border border-white/5 transition-all hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none"></div>
                <div
                  className={`w-12 h-12 rounded flex items-center justify-center mb-5 text-xl bg-gradient-to-r ${feature.gradient} text-white`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-[0.9375rem] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="bg-black py-20 relative overflow-hidden">
        <div className="absolute w-[30rem] h-[30rem] rounded-full bg-blue-500 filter blur-[100px] opacity-5 top-[-15rem] right-[-15rem] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-2.5 py-1 bg-indigo-500/10 text-white rounded-md text-sm font-medium mb-4 border border-indigo-500/20">
              Dashboard
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Powerful and{" "}
              <span className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                Intuitive Interface
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Customize your workspace to fit your unique workflow needs.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex gap-1 mb-6 bg-white/[0.03] p-1 rounded-md border border-white/5">
              <button className="px-6 py-3 rounded text-sm font-medium bg-indigo-500/10 text-white">Projects</button>
              <button className="px-6 py-3 rounded text-sm font-medium text-gray-300 hover:bg-white/5">Calendar</button>
              <button className="px-6 py-3 rounded text-sm font-medium text-gray-300 hover:bg-white/5">
                Analytics
              </button>
              <button className="px-6 py-3 rounded text-sm font-medium text-gray-300 hover:bg-white/5">Team</button>
            </div>

            <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-blue-500/10">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-taskboard-VWqtqUro0OopY9Ptu1cJ3rsD9hpvSt.png"
                alt="Integral Dashboard View"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-black py-24 border-y border-white/5 relative">
        <div className="absolute w-[30rem] h-[30rem] rounded-full bg-pink-500 filter blur-[100px] opacity-5 top-[-15rem] left-[-15rem] pointer-events-none"></div>

        <div className="container mx-auto px-6">
          <div className="bg-white/[0.02] rounded-[2rem] p-12 max-w-3xl mx-auto border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none"></div>

            <p className="text-2xl font-medium text-white mb-8 leading-relaxed">
              "
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Integral
              </span>{" "}
              has completely transformed how our team works. The intuitive interface and powerful features have
              increased our productivity by 35% in just two months."
            </p>

            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-transparent bg-white p-[2px]"
                style={{
                  backgroundImage:
                    "linear-gradient(white, white) padding-box, linear-gradient(135deg, #6366f1, #ec4899) border-box",
                }}
              >
                <img
                  src="/placeholder.svg?height=100&width=100"
                  alt="Sarah Johnson"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="text-lg font-semibold text-white">Sarah Johnson</div>
              <div className="text-sm text-gray-400">Product Manager at Acme Inc.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-black py-24 relative overflow-hidden">
        <div className="absolute w-[30rem] h-[30rem] rounded-full bg-teal-500 filter blur-[100px] opacity-5 top-[-15rem] right-[-15rem] pointer-events-none"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full bg-blue-500 filter blur-[100px] opacity-5 bottom-[-15rem] left-[-15rem] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-2.5 py-1 bg-indigo-500/10 text-white rounded-md text-sm font-medium mb-4 border border-indigo-500/20">
              Pricing
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Flexible pricing options tailored to your needs with no hidden fees.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 items-stretch">
            {[
              {
                name: "Starter",
                price: "$0",
                period: "Forever free",
                features: ["Up to 3 team members", "5 projects", "Basic analytics", "24/7 support"],
                buttonText: "Get Started",
                buttonVariant: "outline",
                featured: false,
              },
              {
                name: "Pro",
                price: "$12",
                period: "per user / month",
                features: ["Unlimited team members", "Unlimited projects", "Advanced analytics", "Priority support"],
                buttonText: "Start Free Trial",
                buttonVariant: "primary",
                featured: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "Contact for pricing",
                features: [
                  "Everything in Pro",
                  "Custom integrations",
                  "Dedicated account manager",
                  "SLA & premium support",
                ],
                buttonText: "Contact Sales",
                buttonVariant: "outline",
                featured: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-white/[0.02] rounded-2xl p-8 w-full max-w-xs border ${plan.featured ? "border-indigo-500/30 shadow-lg shadow-indigo-500/20" : "border-white/5"} transition-all hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/20 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none"></div>

                <div className="mb-6">
                  <div className="text-lg font-semibold text-white mb-2">{plan.name}</div>
                  <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                  <div className="text-sm text-gray-400">{plan.period}</div>
                </div>

                <div className="mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center mb-3 text-[0.9375rem] text-gray-300">
                      <span className="text-indigo-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-md text-sm font-medium ${
                    plan.buttonVariant === "primary"
                      ? "text-white relative overflow-hidden z-10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-500 before:to-pink-500 before:z-[-1] hover:before:opacity-90 hover:translate-y-[-2px] transition-transform"
                      : "border border-gray-700 text-white hover:bg-white/5 transition-colors"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="bg-black py-20 relative overflow-hidden">
        <div className="absolute w-[30rem] h-[30rem] rounded-full bg-indigo-500 filter blur-[100px] opacity-5 top-[-15rem] right-[-15rem] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                Workflow?
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of teams already using Integral to boost their productivity.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 rounded-md text-base font-medium text-white relative overflow-hidden z-10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-500 before:to-pink-500 before:z-[-1] hover:before:opacity-90 hover:translate-y-[-2px] transition-transform"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-semibold">
                  I
                </div>
                <div className="font-['Poppins'] text-xl font-semibold text-white">Integral</div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                The all-in-one workspace for teams to collaborate, manage projects, and boost productivity.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Features
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Pricing
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Integrations
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Changelog
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Roadmap
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Blog
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Documentation
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Guides
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Webinars
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Templates
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  About
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Careers
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Contact
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Partners
                </a>
                <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Press
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t border-white/5">
            <div className="text-gray-500 text-sm">© 2025 Integral. All rights reserved.</div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

