"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChefHat, Martini, Calendar, Users, Award, Sparkles } from "lucide-react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

export default function Home() {
  const [showBoard, setShowBoard] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hide board when scrolled down more than 100px
      if (window.scrollY > 100) {
        setShowBoard(false)
      } else {
        setShowBoard(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="page-transition">
      {/* Coming Soon Board - Square shape, fixed below navbar */}
      <div 
        className={`fixed top-20 right-8 z-40 transition-opacity duration-500 ${
          showBoard ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Nail */}
        <div className="w-3 h-3 bg-gray-700 rounded-full mx-auto mb-1 shadow-md"></div>
        
        {/* Square Swinging Board */}
        <div className="swing-animation bg-[#5E3023] text-[#F3E9DC] w-48 h-48 flex items-center justify-center rounded-lg shadow-2xl border-4 border-[#C08552]">
          <p className="text-3xl font-serif font-bold text-center">
            Coming<br />Soon
          </p>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#5E3023] via-[#895737] to-[#C08552] pt-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/cinematic-wide-shot-of-upscale-indian-restaurant-1765004257108.png?width=8000&height=8000&resize=contain')] bg-cover bg-center"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Logo - Centered */}
          <div className="mb-8 md:mb-12 flex justify-center">
            <div className="relative w-[300px] sm:w-[400px] md:w-[500px] h-[180px] sm:h-[240px] md:h-[300px]">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/SIRI-1764986634234.png?width=8000&height=8000&resize=contain"
                alt="SIRI Logo"
                fill
                className="drop-shadow-2xl object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 drop-shadow-2xl">
            SIRI Indian Kitchen & Cocktails
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 font-light max-w-3xl mx-auto drop-shadow-lg">
            Experience the authentic flavors of North & South Indian cuisine paired with innovative craft cocktails
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/menu"
              className="button-slide bg-accent text-accent-foreground px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-accent/90 transition-colors w-full sm:w-auto"
            >
              View Menu
            </Link>
            <Link
              href="/contact"
              className="button-slide bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Concept Overview */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              The SIRI Experience
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              SIRI Indian Kitchen & Cocktails brings together the rich culinary traditions of India's diverse regions with contemporary mixology artistry. Our carefully curated menu showcases authentic flavors, time-honored recipes, and innovative presentations that create an unforgettable dining journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 md:p-8 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-accent/10 rounded-full mb-4">
                <ChefHat className="h-7 w-7 md:h-8 md:w-8 text-accent" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3">Regional Authenticity</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Experience the diverse flavors from North and South India, each dish crafted with traditional techniques and premium ingredients.
              </p>
            </div>

            <div className="text-center p-6 md:p-8 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-accent/10 rounded-full mb-4">
                <Martini className="h-7 w-7 md:h-8 md:w-8 text-accent" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3">Craft Cocktails</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Innovative mixology featuring Indian-inspired cocktails with house-made infusions, spices, and premium spirits.
              </p>
            </div>

            <div className="text-center p-6 md:p-8 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-accent/10 rounded-full mb-4">
                <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-accent" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3">Elevated Dining</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                An elegant ambiance perfect for intimate dinners, celebrations, and special occasions with impeccable service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#DAB49D] to-[#C08552]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-[#5E3023]">
                A Culinary Journey Through India
              </h2>
              <p className="text-base sm:text-lg text-[#5E3023]/80 mb-6 md:mb-8 leading-relaxed">
                From the rich, creamy curries of North India to the aromatic spices of South Indian cuisine, SIRI offers a comprehensive exploration of India's culinary heritage. Our chefs bring decades of experience, preparing each dish with passion and precision.
              </p>
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#5E3023] rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 md:h-6 md:w-6 text-[#F3E9DC]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-semibold mb-1 md:mb-2 text-[#5E3023]">Award-Winning Cuisine</h3>
                    <p className="text-sm md:text-base text-[#5E3023]/80">Recognized for excellence in authentic Indian dining and innovative menu concepts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#5E3023] rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-[#F3E9DC]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-semibold mb-1 md:mb-2 text-[#5E3023]">Weekend Brunch</h3>
                    <p className="text-sm md:text-base text-[#5E3023]/80">Sunday brunch featuring unique Indian breakfast specialties and signature cocktails.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#5E3023] rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-[#F3E9DC]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-semibold mb-1 md:mb-2 text-[#5E3023]">Private Events</h3>
                    <p className="text-sm md:text-base text-[#5E3023]/80">Banquet facilities accommodating up to 150 guests for weddings, corporate events, and celebrations.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/experience"
                className="button-slide inline-block mt-6 md:mt-8 bg-[#5E3023] text-[#F3E9DC] px-6 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-[#5E3023]/90 transition-colors text-sm md:text-base"
              >
                Discover More
              </Link>
            </div>

            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden order-1 lg:order-2">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/restaurant-1764634964836.jpg?width=8000&height=8000&resize=contain"
                alt="SIRI Restaurant Interior"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Ready to Experience SIRI?
          </h2>
          <p className="text-lg sm:text-xl mb-6 md:mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Reserve your table today and embark on a culinary journey celebrating India's finest flavors.
          </p>
          <Link
            href="/contact"
            className="button-slide inline-block bg-accent text-accent-foreground px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Make a Reservation
          </Link>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  )
}