"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { data, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
      callbackURL: "/admin"
    })

    if (error?.code) {
      toast.error("Invalid email or password. Please make sure you have already registered an account and try again.")
      setIsLoading(false)
      return
    }

    toast.success("Login successful!")
    router.push("/admin")
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
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-[#895737]">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-[#C08552] hover:text-[#5E3023]">
              Register here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#C08552] focus:ring-[#C08552] border-[#DAB49D] rounded"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[#5E3023]">
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-[#F3E9DC] bg-[#5E3023] hover:bg-[#895737] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C08552] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}