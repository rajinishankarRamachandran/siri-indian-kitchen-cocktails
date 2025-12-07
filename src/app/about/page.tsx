"use client";

import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Award, Heart, Users2, Sparkles } from "lucide-react";

export default function AboutPage() {
  const team = [
  {
    name: "Amit",
    role: "CEO & Strategic Advisor",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/amith-ji-1764538805166.png?width=8000&height=8000&resize=contain",
    bio: "With over 20 years of culinary expertise spanning North and South Indian cuisines, Amit brings authentic flavors and innovative techniques to every dish."
  },
  {
    name: "Neeraj Shokeen",
    role: "Restaurant & Catering Director",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/neeraj-ji-1764633986417.png?width=8000&height=8000&resize=contain",
    bio: "Neeraj's passion for mixology and hospitality drives SIRI's renowned cocktail program, blending Indian flavors with contemporary craft techniques."
  }];


  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="page-transition">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden mt-20 px-4">
        {/* Background Image */}
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765004456427.jpg?width=8000&height=8000&resize=contain"
          alt="SIRI Restaurant Interior"
          fill
          className="object-cover object-center"
          priority
          unoptimized />

        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            A journey of passion, heritage, and culinary innovation
          </p>
        </div>
      </section>

      {/* The SIRI Story */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-center">
              The SIRI Legacy
            </h2>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 md:space-y-6">
              <p className="text-base sm:text-lg leading-relaxed">
                SIRI Indian Kitchen & Cocktails represents the evolution of a beloved culinary institution. Born from the transformation of the iconic Mantra restaurant, SIRI carries forward a legacy of excellence while embracing a bold new vision for Indian dining.
              </p>
              
              <p className="text-base sm:text-lg leading-relaxed">
                The name "SIRI" embodies our philosophy – a celebration of the essence, the heart, and the soul of Indian cuisine. Where Mantra established a foundation of authentic flavors and warm hospitality, SIRI elevates that tradition with contemporary presentation, innovative cocktails, and an atmosphere that honors both heritage and modernity.
              </p>
              
              <p className="text-base sm:text-lg leading-relaxed">
                Our culinary journey spans the diverse regions of India, from the rich, aromatic dishes of the North to the vibrant, spice-forward flavors of the South. Each recipe is a tribute to time-honored cooking methods, premium ingredients, and the passionate craftsmanship of our culinary team.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                At SIRI, we believe dining is more than just a meal – it's an experience that engages all senses. Our craft cocktail program seamlessly integrates Indian botanicals, spices, and flavors, creating libations that complement and enhance our culinary offerings. This unique pairing of food and drink creates a harmonious dining journey unlike any other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F3E9DC] to-[#DAB49D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-12 md:mb-16 text-center text-[#5E3023]">
            What Defines Us
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#C08552] rounded-full mb-4">
                <Award className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="font-serif text-lg md:text-xl font-semibold mb-3 text-[#5E3023]">Authenticity</h3>
              <p className="text-sm md:text-base text-[#5E3023]/80">
                True to traditional recipes and cooking techniques passed down through generations
              </p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#C08552] rounded-full mb-4">
                <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="font-serif text-lg md:text-xl font-semibold mb-3 text-[#5E3023]">Innovation</h3>
              <p className="text-sm md:text-base text-[#5E3023]/80">
                Contemporary presentation and creative pairings that honor tradition while embracing modernity
              </p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#C08552] rounded-full mb-4">
                <Heart className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="font-serif text-lg md:text-xl font-semibold mb-3 text-[#5E3023]">Passion</h3>
              <p className="text-sm md:text-base text-[#5E3023]/80">
                Every dish crafted with dedication, care, and love for the culinary arts
              </p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#C08552] rounded-full mb-4">
                <Users2 className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="font-serif text-lg md:text-xl font-semibold mb-3 text-[#5E3023]">Hospitality</h3>
              <p className="text-sm md:text-base text-[#5E3023]/80">
                Warm, attentive service that makes every guest feel like family
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Mantra Transformation */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/authentic-indian-restaurant-interior-traditional-1765005838713.png?width=8000&height=8000&resize=contain"
                alt="From Tradition to Innovation"
                fill
                className="object-cover"
                unoptimized />

            </div>

            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                From Mantra to SIRI
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                Mantra established itself as a cornerstone of authentic Indian dining, beloved by the community for its traditional flavors and warm atmosphere. As we evolved into SIRI, we carried forward everything our guests cherished while embracing new possibilities.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                The transformation represents growth and renewal. We've expanded our culinary repertoire, introduced an innovative cocktail program, and redesigned our space to create an elevated yet welcoming environment. Our commitment to quality ingredients, authentic preparation, and exceptional service remains unwavering.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                SIRI is both a tribute to our past and a celebration of our future – where the soul of Mantra lives on in every dish, enhanced by new creative expressions and contemporary touches that define modern Indian cuisine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Profiles */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#DAB49D] to-[#C08552]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-[#5E3023]">
              Meet Our Team
            </h2>
            <p className="text-base sm:text-lg text-[#5E3023]/80">
              The passionate individuals behind SIRI's culinary excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {team.map((member, index) =>
            <div key={index} className="bg-white rounded-lg overflow-hidden border border-[#895737]/20 hover:shadow-xl transition-shadow">
                <div className="relative h-64 sm:h-72 md:h-80 w-full bg-[#F3E9DC]">
                  <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top" />

                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold mb-2 text-[#5E3023]">{member.name}</h3>
                  <p className="text-[#C08552] font-medium mb-3 md:mb-4 text-sm md:text-base">{member.role}</p>
                  <p className="text-[#5E3023]/80 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Experience Our Story
          </h2>
          <p className="text-lg sm:text-xl mb-6 md:mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Join us for an unforgettable culinary journey that honors tradition and celebrates innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/menu"
              className="button-slide inline-block bg-accent text-accent-foreground px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-accent/90 transition-colors">

              View Menu
            </a>
            <a
              href="/contact"
              className="button-slide inline-block border-2 border-primary-foreground text-primary-foreground px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-primary-foreground hover:text-primary transition-colors">

              Reserve Table
            </a>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>);

}