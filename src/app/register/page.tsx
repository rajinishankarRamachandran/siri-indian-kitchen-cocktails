"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    const { error } = await authClient.signUp.email({
      email: formData.email,
      name: formData.name,
      password: formData.password
    })

    if (error?.code) {
      const errorMap: Record<string, string> = {
        USER_ALREADY_EXISTS: "Email already registered"
      }
      toast.error(errorMap[error.code] || "Registration failed")
      setIsLoading(false)
      return
    }

    toast.success("Account created successfully!")
    router.push("/login?registered=true")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5E3023] via-[#895737] to-[#C08552] py-12 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-md w-full space-y-8 bg-[#F3E9DC] p-10 rounded-2xl shadow-2xl">
        <div>
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/siri-remodel-1764363388439.png?width=8000&height=8000&resize=contain"
            alt="SIRI Logo"
            width={200}
            height={100}
            className="mx-auto"
            unoptimized
          />
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-[#5E3023]">
            Create Admin Account
          </h2>
          <p className="mt-2 text-center text-sm text-[#895737]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#C08552] hover:text-[#5E3023]">
              Sign in here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#5E3023] mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-[#DAB49D] placeholder-[#895737]/50 text-[#5E3023] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552] focus:border-transparent"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5E3023] mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-[#DAB49D] placeholder-[#895737]/50 text-[#5E3023] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552] focus:border-transparent"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#5E3023] mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-[#DAB49D] placeholder-[#895737]/50 text-[#5E3023] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552] focus:border-transparent"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5E3023] mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="off"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-[#DAB49D] placeholder-[#895737]/50 text-[#5E3023] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552] focus:border-transparent"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-[#F3E9DC] bg-[#5E3023] hover:bg-[#895737] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C08552] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}