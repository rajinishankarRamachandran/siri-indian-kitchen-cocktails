"use client"

import Image from "next/image"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { useState } from "react"
import { PhoneSelectDialog } from "@/components/PhoneSelectDialog"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    period: "PM",
    guests: "2",
    message: ""
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Convert 12-hour time to 24-hour format for submission
    const formattedTime = formatTo24Hour(formData.time, formData.period)
    
    // Combine first and last name
    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    
    try {
      // Save to database
      const dbResponse = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formattedTime,
          guests: formData.guests,
          message: formData.message
        }),
      })

      if (!dbResponse.ok) {
        throw new Error('Failed to save reservation')
      }

      // Send email notification
      const emailResponse = await fetch('/api/send-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formattedTime,
          guests: formData.guests,
          message: formData.message
        }),
      })

      const emailData = await emailResponse.json()

      if (!emailResponse.ok) {
        // Reservation saved but email failed - still show success
        console.error('Email notification failed:', emailData.error)
      }

      // Success
      setSubmitted(true)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        period: "PM",
        guests: "2",
        message: ""
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reservation. Please try again or call us directly.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTo24Hour = (time: string, period: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(':')
    let hour = parseInt(hours)
    
    if (period === 'PM' && hour !== 12) {
      hour += 12
    } else if (period === 'AM' && hour === 12) {
      hour = 0
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="page-transition">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden mt-20">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/cinematic-aesthetic-shot-of-authentic-indian-resta-1765006832701.png?width=8000&height=8000&resize=contain"
          alt="SIRI Restaurant Interior"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
            Visit Us
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            We look forward to welcoming you
          </p>
        </div>
      </section>

      {/* Contact Information & Reservation Form */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 md:mb-8">
                Get In Touch
              </h2>
              
              <div className="space-y-5 md:space-y-6 mb-8 md:mb-10">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">Location</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      275 Rte 4 West<br />
                      Paramus, NJ 07652<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">Phone</h3>
                    <div className="text-sm md:text-base text-muted-foreground space-y-1">
                      <p>Neeraj Shokeen: +1 (848) 260-8267</p>
                      <p>Amit: +1 (201) 214-0953</p>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Monday - Sunday, 11:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">Email</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      corporate@sirirestaurant.com
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      For general inquiries and event bookings
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div className="w-full">
                    <h3 className="font-semibold text-base md:text-lg mb-2">Hours of Operation</h3>
                    <div className="space-y-1 text-muted-foreground text-sm md:text-base">
                      <p className="flex justify-between flex-wrap gap-2">
                        <span className="font-medium">Monday - Thursday:</span>
                        <span>11:30 AM - 10:00 PM</span>
                      </p>
                      <p className="flex justify-between flex-wrap gap-2">
                        <span className="font-medium">Friday - Saturday:</span>
                        <span>11:30 AM - 11:00 PM</span>
                      </p>
                      <p className="flex justify-between flex-wrap gap-2">
                        <span className="font-medium">Sunday (Brunch):</span>
                        <span>10:00 AM - 9:00 PM</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
                <a
                  href="https://www.google.com/maps/place/275+Rte+4,+Paramus,+NJ+07652/@40.9150281,-74.0495701,17z/data=!3m1!4b1!4m6!3m5!1s0x89c2fa642ddf627f:0x3d401846a979e95a!8m2!3d40.9150281!4d-74.0469952!16s%2Fg%2F11bw3yj07t?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-pointer group"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3016.8234567890123!2d-74.0495701!3d40.9150281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2fa642ddf627f%3A0x3d401846a979e95a!2s275%20Rte%204%2C%20Paramus%2C%20NJ%2007652!5e0!3m2!1sen!2sus!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="pointer-events-none group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/95 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg">
                      <p className="text-[#5E3023] font-semibold flex items-center gap-2 text-sm md:text-base">
                        <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                        Open in Google Maps
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Reservation Form */}
            <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
                Make a Reservation
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Reserve your table and we'll confirm your booking shortly
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg">
                  <p className="text-accent font-medium text-sm md:text-base">
                    ✓ Thank you for your reservation request! We'll contact you shortly to confirm.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-destructive font-medium text-sm md:text-base">
                    ✗ {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="First Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="+1 123456789"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-2">
                      Time *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        id="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <select
                        name="period"
                        value={formData.period}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="px-3 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium mb-2">
                    Number of Guests *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                    <option value="10+">10+ Guests (Private Event)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="button-slide w-full bg-accent text-accent-foreground py-3 md:py-4 rounded-full font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 md:h-5 md:w-5" />
                      Submit Reservation
                    </>
                  )}
                </button>

                <p className="text-xs md:text-sm text-muted-foreground text-center">
                  For parties of 10 or more, please call us directly at (555) 123-4567
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F3E9DC] to-[#DAB49D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 md:mb-6 text-[#5E3023]">
              Private Events & Catering
            </h2>
            <p className="text-base sm:text-lg text-[#5E3023]/80 mb-6 md:mb-8 leading-relaxed">
              Planning a special event? Our banquet facilities can accommodate up to 150 guests, and our catering services bring the SIRI experience to your venue. Contact us to discuss custom menus, event coordination, and availability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PhoneSelectDialog>
                <button className="inline-block bg-primary text-primary-foreground px-6 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm md:text-base">
                  Call for Events
                </button>
              </PhoneSelectDialog>
              <a
                href="mailto:events@sirirestaurant.com"
                className="inline-block border-2 border-primary text-primary px-6 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-sm md:text-base"
              >
                Email Events Team
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  )
}
