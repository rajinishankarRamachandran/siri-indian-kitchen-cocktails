"use client"

import Image from "next/image"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Utensils, Martini, Coffee, Users, Truck, Clock } from "lucide-react"
import Link from "next/link"

export default function ExperiencePage() {
  const services = [
    {
      icon: Utensils,
      title: "Elevated Dining",
      description: "Immerse yourself in an elegant dining atmosphere where authentic Indian flavors meet contemporary presentation. Our carefully curated menu showcases the best of regional specialties.",
      hours: "Mon-Thu: 11:30 AM - 10:00 PM | Fri-Sat: 11:30 AM - 11:00 PM",
      gradient: "from-[#895737] to-[#5E3023]",
      imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/elevated-dining-1764987220689.jpg?width=8000&height=8000&resize=contain"
    },
    {
      icon: Martini,
      title: "Bar & Craft Cocktails",
      description: "Our innovative cocktail program features Indian-inspired libations crafted with house-made infusions, exotic spices, and premium spirits. An extensive wine and beer selection complements our offerings.",
      hours: "Bar Open: Mon-Thu: 4:00 PM - 10:00 PM | Fri-Sat: 4:00 PM - 12:00 AM",
      gradient: "from-[#C08552] to-[#895737]",
      imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/cocktail-1764992797043.png?width=8000&height=8000&resize=contain"
    },
    {
      icon: Coffee,
      title: "Weekend Brunch",
      description: "Discover a unique Sunday brunch experience featuring Indian breakfast classics, fusion creations, and bottomless mimosas. A delightful way to start your weekend.",
      hours: "Sunday: 10:00 AM - 3:00 PM",
      gradient: "from-[#DAB49D] to-[#C08552]",
      imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/brunch-1764993430259.jpg?width=8000&height=8000&resize=contain"
    },
    {
      icon: Users,
      title: "Banquets & Private Events",
      description: "Host your special occasion in our elegant banquet space accommodating up to 150 guests. Perfect for weddings, corporate events, celebrations, and milestone gatherings.",
      hours: "Contact us for availability and custom packages",
      gradient: "from-[#5E3023] to-[#895737]",
      imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/catering-banquets-1764993689279.jpg?width=8000&height=8000&resize=contain"
    },
    {
      icon: Truck,
      title: "Catering Services",
      description: "Bring SIRI's authentic flavors to your venue. Our full-service catering offers customizable menus for any event size, from intimate gatherings to large celebrations.",
      hours: "Available 7 days a week with advance booking",
      gradient: "from-[#895737] to-[#C08552]",
      imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/catering-services-1764994032181.jpg?width=8000&height=8000&resize=contain"
    }
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="page-transition">
      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden mt-20 px-4"
      >
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/cinematic-aesthetic-shot-of-authentic-indian-fine-1765006382463.png?width=8000&height=8000&resize=contain"
          alt="SIRI Restaurant Interior"
          fill
          className="object-cover object-center"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
            The SIRI Experience
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Every moment crafted for excellence
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Our Services
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              From intimate dinners to grand celebrations, SIRI offers comprehensive dining and event services
            </p>
          </div>

          <div className="space-y-12 md:space-y-16">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-accent/10 rounded-full mb-4 md:mb-6">
                    <service.icon className="h-7 w-7 md:h-8 md:w-8 text-accent" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 md:mb-4">{service.title}</h3>
                  <p className="text-base sm:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                    <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{service.hours}</p>
                  </div>
                </div>

                {service.imageUrl ? (
                  <div className={`relative h-[250px] sm:h-[350px] md:h-[400px] rounded-lg overflow-hidden ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className={`relative h-[250px] sm:h-[350px] md:h-[400px] rounded-lg overflow-hidden bg-gradient-to-br ${service.gradient} flex items-center justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="text-center text-[#F3E9DC] p-6 md:p-8">
                      <service.icon className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 mx-auto mb-4 opacity-50" />
                      <h4 className="font-serif text-xl md:text-2xl font-bold">{service.title}</h4>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operating Hours Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F3E9DC] to-[#DAB49D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-center text-[#5E3023]">
              Hours of Operation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-[#C08552]/20">
                <h3 className="font-serif text-xl md:text-2xl font-semibold mb-4 md:mb-6 flex items-center gap-3 text-[#5E3023]">
                  <Utensils className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  Restaurant
                </h3>
                <div className="space-y-3 text-[#5E3023]/80 text-sm md:text-base">
                  <div className="flex justify-between py-2 border-b border-[#DAB49D] flex-wrap gap-2">
                    <span className="font-medium">Monday - Thursday</span>
                    <span>11:30 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#DAB49D] flex-wrap gap-2">
                    <span className="font-medium">Friday - Saturday</span>
                    <span>11:30 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 flex-wrap gap-2">
                    <span className="font-medium">Sunday (Brunch)</span>
                    <span>10:00 AM - 9:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-[#C08552]/20">
                <h3 className="font-serif text-xl md:text-2xl font-semibold mb-4 md:mb-6 flex items-center gap-3 text-[#5E3023]">
                  <Martini className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  Bar
                </h3>
                <div className="space-y-3 text-[#5E3023]/80 text-sm md:text-base">
                  <div className="flex justify-between py-2 border-b border-[#DAB49D] flex-wrap gap-2">
                    <span className="font-medium">Monday - Thursday</span>
                    <span>4:00 PM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#DAB49D] flex-wrap gap-2">
                    <span className="font-medium">Friday - Saturday</span>
                    <span>4:00 PM - 12:00 AM</span>
                  </div>
                  <div className="flex justify-between py-2 flex-wrap gap-2">
                    <span className="font-medium">Sunday</span>
                    <span>12:00 PM - 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8 bg-[#C08552]/20 p-5 md:p-6 rounded-lg text-center">
              <p className="text-[#5E3023]/80 text-sm md:text-base">
                <strong>Please Note:</strong> Hours may vary on holidays. We recommend calling ahead or making a reservation to ensure availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banquet Details */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/luxurious-indian-banquet-hall-for-private-events-1765005982543.png?width=8000&height=8000&resize=contain"
                alt="Luxurious Indian Banquet Hall"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                Private Events & Banquets
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 md:mb-6 leading-relaxed">
                Our stunning banquet facility transforms your vision into reality. With a capacity of up to 150 guests, SIRI provides the perfect setting for weddings, anniversaries, corporate gatherings, and celebrations of all kinds.
              </p>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-sm md:text-base text-muted-foreground">Customizable menu options featuring our signature dishes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-sm md:text-base text-muted-foreground">Full bar service with craft cocktails and premium spirits</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-sm md:text-base text-muted-foreground">Dedicated event coordinator to assist with planning</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-sm md:text-base text-muted-foreground">Audio-visual equipment and presentation capabilities</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-sm md:text-base text-muted-foreground">Flexible room configurations for any event style</p>
                </div>
              </div>

              <Link
                href="/contact"
                className="button-slide inline-block bg-accent text-accent-foreground px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Inquire About Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Ready to Experience SIRI?
          </h2>
          <p className="text-lg sm:text-xl mb-6 md:mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Whether it's dinner for two or a celebration for 150, we're here to make it memorable.
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