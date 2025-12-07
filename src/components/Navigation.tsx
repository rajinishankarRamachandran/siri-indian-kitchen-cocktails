"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Lock } from "lucide-react"
import Image from "next/image"
import { useSession } from "@/lib/auth-client"

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/experience", label: "Experience" },
    { href: "/menu", label: "Menu" },
    { href: "/catering", label: "Catering" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20 relative">
          {/* Mobile menu button - positioned absolutely on the right for mobile */}
          <button
            className="md:hidden p-2 absolute right-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Centered content container */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/SIRI-1764986634234.png?width=8000&height=8000&resize=contain"
                alt="SIRI Indian Kitchen & Cocktails"
                width={120}
                height={60}
                className="h-12 w-auto"
                unoptimized
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    pathname === link.href
                      ? "text-accent"
                      : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {session?.user && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-accent flex items-center gap-1 ${
                    pathname === "/admin"
                      ? "text-accent"
                      : "text-foreground/80"
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-base font-medium ${
                  pathname === link.href
                    ? "text-accent"
                    : "text-foreground/80"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {session?.user && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 py-2 text-base font-medium ${
                  pathname === "/admin"
                    ? "text-accent"
                    : "text-foreground/80"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Lock className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}