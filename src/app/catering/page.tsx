"use client"

import Image from "next/image"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Truck, Users, ChefHat, Calendar, Check, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function CateringPage() {
  const serviceTypes = [
    {
      title: "Corporate Events",
      description: "Impress clients and colleagues with authentic Indian cuisine. Perfect for business meetings, conferences, and corporate celebrations.",
      icon: Users
    },
    {
      title: "Private Parties",
      description: "Celebrate birthdays, anniversaries, and family gatherings with our customizable catering menus featuring your favorite dishes.",
      icon: ChefHat
    },
    {
      title: "Weddings",
      description: "Make your special day unforgettable with our comprehensive wedding catering services, from intimate ceremonies to grand receptions.",
      icon: Calendar
    },
    {
      title: "Social Events",
      description: "From holiday parties to community gatherings, we bring restaurant-quality Indian cuisine to your venue.",
      icon: Truck
    }
  ]

  const menuOptions = [
    "Authentic regional North Indian",
    "South Indian",
    "Gujarati",
    "International options",
    "Indian-inspired international cuisine"
  ]

  const features = [
    "Customizable menus to suit your preferences and dietary needs",
    "Professional setup and presentation",
    "Experienced serving staff available",
    "Full bar service with craft cocktails",
    "Delivery or on-site preparation options",
    "Accommodates groups from 10 to 500+ guests",
    "Flexible pricing packages",
    "Dedicated event coordinator"
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="page-transition">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden mt-20 px-4">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/cinematic-shot-of-elaborate-indian-catering-setup-1765004927145.png?width=8000&height=8000&resize=contain"
          alt="Indian Catering Setup"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          <Truck className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 md:mb-6 opacity-90" />
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
            Catering Services
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed">
            Bring SIRI's authentic Indian flavors to your venue. From intimate gatherings to grand celebrations, we deliver an unforgettable culinary experience.
          </p>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Events We Cater
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              No matter the occasion, SIRI brings restaurant-quality cuisine and service to your location
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {serviceTypes.map((service, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-lg p-6 md:p-8 hover:border-accent transition-colors"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-accent/10 rounded-full mb-4 md:mb-6">
                  <service.icon className="h-7 w-7 md:h-8 md:w-8 text-accent" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Options */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F3E9DC] to-[#DAB49D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-[#5E3023]">
                Customizable Menu Options
              </h2>
              <p className="text-base sm:text-lg text-[#5E3023]/80 mb-8">
                Create the perfect menu for your event from our extensive selection of authentic dishes
              </p>
              
              {/* Side by side menu options */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {menuOptions.map((option, index) => (
                  <div 
                    key={index}
                    className="bg-white/80 backdrop-blur-sm px-6 md:px-8 py-4 md:py-5 rounded-lg border border-[#C08552]/20 flex items-center gap-3"
                  >
                    <Check className="h-6 w-6 md:h-7 md:w-7 text-accent flex-shrink-0" />
                    <p className="text-[#5E3023] font-semibold text-base md:text-lg lg:text-xl">{option}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 md:mt-12 bg-[#C08552]/20 p-6 md:p-8 rounded-lg text-center">
              <p className="text-[#5E3023] text-base sm:text-lg mb-3 md:mb-4">
                <strong>Don't see what you're looking for?</strong>
              </p>
              <p className="text-[#5E3023]/80 text-sm md:text-base">
                We're happy to work with you to create a custom menu that perfectly matches your event's theme, dietary requirements, and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/aesthetic-cinematic-festive-indian-catering-servic-1765005324203.png?width=8000&height=8000&resize=contain"
                alt="Full-Service Catering Setup"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8">
                Why Choose SIRI Catering?
              </h2>
              
              <div className="space-y-3 md:space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm md:text-base text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12">
              How to Book
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-lg">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-accent text-accent-foreground rounded-full font-bold text-lg md:text-xl mb-4">
                  1
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold mb-3">Contact Us</h3>
                <p className="text-primary-foreground/80 text-sm md:text-base">
                  Reach out via phone, email, or our contact form to discuss your event details
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-lg">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-accent text-accent-foreground rounded-full font-bold text-lg md:text-xl mb-4">
                  2
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold mb-3">Plan Together</h3>
                <p className="text-primary-foreground/80 text-sm md:text-base">
                  Work with our event coordinator to customize your menu and service details
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-lg">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-accent text-accent-foreground rounded-full font-bold text-lg md:text-xl mb-4">
                  3
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold mb-3">Enjoy Your Event</h3>
                <p className="text-primary-foreground/80 text-sm md:text-base">
                  Relax and let SIRI handle the food while you focus on your guests
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg mb-6 md:mb-8 text-primary-foreground/90">
              <strong>Advance Booking Required:</strong> Please contact us at least 2 weeks in advance for smaller events and 4-6 weeks for larger gatherings or weddings.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#DAB49D] to-[#F3E9DC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-[#5E3023]">
              Let's Plan Your Event
            </h2>
            <p className="text-lg sm:text-xl mb-8 md:mb-10 text-[#5E3023]/80">
              Contact us today to discuss your catering needs and receive a customized quote
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-2xl mx-auto mb-8 md:mb-10">
              <a 
                href="tel:+1234567890"
                className="flex items-center justify-center gap-3 bg-accent text-accent-foreground px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-accent/90 transition-colors"
              >
                <Phone className="h-5 w-5" />
                Call Us
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-3 bg-[#5E3023] text-[#F3E9DC] px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-[#5E3023]/90 transition-colors"
              >
                <Mail className="h-5 w-5" />
                Contact Form
              </Link>
            </div>

            <p className="text-[#5E3023]/70 text-sm md:text-base">
              Available 7 days a week with advance booking
            </p>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  )
}