import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="mb-6">
              <div className="flex items-center justify-center md:justify-start">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/SIRI-1764986634234.png?width=8000&height=8000&resize=contain"
                  alt="SIRI Logo"
                  width={200}
                  height={100}
                  className="h-20 md:h-24 w-auto"
                  unoptimized
                />
              </div>
            </div>
            <p className="text-xs md:text-sm text-primary-foreground/80">
              Authentic regional Indian cuisine paired with modern craft cocktails. An elevated dining experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base md:text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-xs md:text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/experience" className="text-xs md:text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-xs md:text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs md:text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-base md:text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs md:text-sm text-primary-foreground/80">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 mt-0.5 flex-shrink-0" />
                <span>275 Rte 4 West<br />Paramus, NJ 07652</span>
              </li>
              <li className="flex items-center gap-2 text-xs md:text-sm text-primary-foreground/80">
                <Phone className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span>Coming Soon</span>
              </li>
              <li className="flex items-center gap-2 text-xs md:text-sm text-primary-foreground/80">
                <Mail className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span>info@sirirestaurant.com</span>
              </li>
            </ul>
          </div>

          {/* Hours & Social */}
          <div>
            <h3 className="font-serif text-base md:text-lg font-semibold mb-4">Hours</h3>
            <ul className="space-y-2 text-xs md:text-sm text-primary-foreground/80 mb-6">
              <li>Monday - Thursday: 11:30 AM - 10:00 PM</li>
              <li>Friday - Saturday: 11:30 AM - 11:00 PM</li>
              <li>Sunday: 10:00 AM - 9:00 PM (Brunch)</li>
            </ul>
            
            <h3 className="font-serif text-base md:text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-xs md:text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} SIRI Indian Kitchen & Cocktails. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}