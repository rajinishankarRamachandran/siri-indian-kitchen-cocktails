"use client"

import { useEffect, useState } from "react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { ChefHat, Martini, Leaf, Flame, Star, UtensilsCrossed, Soup, Salad } from "lucide-react"
import Image from "next/image"

type Dish = {
  id: number
  name: string
  description: string
  category: string
  price: string
  imageUrl: string | null
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDishes()
  }, [])

  const fetchDishes = async () => {
    try {
      const response = await fetch("/api/dishes")
      if (response.ok) {
        const data = await response.json()
        setDishes(data)
      }
    } catch (error) {
      console.error("Failed to fetch dishes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "North Indian":
        return ChefHat
      case "South Indian":
        return Flame
      case "Cocktails":
        return Martini
      case "Tawa":
        return UtensilsCrossed
      case "Grill":
        return Flame
      case "Curry":
        return Soup
      case "Mains":
        return ChefHat
      case "Sides & Accompaniments":
        return Salad
      case "Appetizers":
      case "Desserts":
      default:
        return Leaf
    }
  }

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "North Indian":
        return "Rich, creamy curries and tandoor specialties from the northern regions"
      case "South Indian":
        return "Aromatic, spice-forward dishes from coastal and interior regions"
      case "Cocktails":
        return "Innovative libations infused with Indian botanicals and spices"
      case "Tawa":
        return "Sizzling specialties cooked on traditional Indian griddle"
      case "Grill":
        return "Tandoor-grilled meats and vegetables with smoky char"
      case "Curry":
        return "Rich, flavorful gravies with authentic spice blends"
      case "Mains":
        return "Signature main courses showcasing India's culinary excellence"
      case "Sides & Accompaniments":
        return "Perfect complements to complete your meal"
      case "Appetizers":
        return "Delicious starters to begin your culinary journey"
      case "Desserts":
        return "Sweet endings with traditional Indian flavors"
      default:
        return "Flavorful dishes celebrating India's culinary tradition"
    }
  }

  // Helper function to check if a dish is zero-proof
  const isZeroProof = (dish: Dish) => {
    const keywords = ['zero-proof', 'zero proof', 'non-alcoholic', 'mocktail', 'virgin']
    const searchText = `${dish.name} ${dish.description}`.toLowerCase()
    return keywords.some(keyword => searchText.includes(keyword))
  }

  const groupedDishes = dishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = []
    }
    acc[dish.category].push(dish)
    return acc
  }, {} as Record<string, Dish[]>)

  const categoryOrder = ["Appetizers", "Tawa", "Grill", "Curry", "Mains", "North Indian", "South Indian", "Sides & Accompaniments", "Cocktails", "Desserts"]
  const sortedCategories = Object.keys(groupedDishes).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a)
    const indexB = categoryOrder.indexOf(b)
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="page-transition">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden mt-20 px-4">
        {/* Background Image */}
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/e8c3f2eb0b35f9fb1c059917fbb74650-1765006739179.jpg?width=8000&height=8000&resize=contain"
          alt="SIRI Indian Kitchen Interior"
          fill
          className="object-cover object-center"
          unoptimized
          priority
        />
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
            Our Menu
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            A culinary journey through India's diverse regions
          </p>
        </div>
      </section>

      {/* Menu Introduction */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Culinary Excellence
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8">
              Our menu celebrates the rich diversity of Indian cuisine, from the creamy, aromatic dishes of the North to the vibrant, spice-forward flavors of the South. Each dish is crafted with authentic techniques, premium ingredients, and a dedication to preserving traditional flavors while adding contemporary touches.
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              <Star className="inline h-5 w-5 text-accent mb-1" /> Menu highlights showcase our most beloved dishes. Full menu available at the restaurant.
            </p>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-[#C08552] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#5E3023]">Loading menu...</p>
            </div>
          </div>
        </section>
      )}

      {/* Menu Sections - Dynamic from Database */}
      {!isLoading && sortedCategories.map((category, sectionIndex) => {
        const categoryDishes = groupedDishes[category]
        const Icon = getCategoryIcon(category)
        
        // For Cocktails category, split into regular and zero-proof
        const regularCocktails = category === "Cocktails" 
          ? categoryDishes.filter(dish => !isZeroProof(dish))
          : categoryDishes
        const zeroProofCocktails = category === "Cocktails"
          ? categoryDishes.filter(dish => isZeroProof(dish))
          : []
        
        return (
          <section 
            key={category} 
            className={sectionIndex % 2 === 0 ? "py-12 md:py-20 bg-background" : "py-12 md:py-20 bg-gradient-to-br from-[#F3E9DC] to-[#DAB49D]"}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-12">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-accent/10 rounded-full mb-4">
                    <Icon className="h-7 w-7 md:h-8 md:w-8 text-accent" />
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">
                    {category}
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                    {getCategoryDescription(category)}
                  </p>
                </div>

                {/* Regular Cocktails or Other Category Dishes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {regularCocktails.map((dish) => (
                    <div 
                      key={dish.id} 
                      className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                    >
                      {/* Image Container - Empty or with uploaded image */}
                      <div className="w-full h-48 bg-muted/30 relative">
                        {dish.imageUrl && (
                          <Image
                            src={dish.imageUrl}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      
                      <div className="p-5 md:p-6">
                        <div className="flex items-start justify-between mb-2 md:mb-3">
                          <h3 className="font-serif text-xl md:text-2xl font-semibold flex-1">{dish.name}</h3>
                          <span className="text-sm font-medium text-[#C08552] ml-3 whitespace-nowrap">
                            {dish.price}
                          </span>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{dish.description}</p>
                        {!dish.isAvailable && (
                          <p className="text-xs text-red-600 mt-2">Currently unavailable</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zero-Proof Creations Subsection - Only for Cocktails */}
                {category === "Cocktails" && zeroProofCocktails.length > 0 && (
                  <div className="mt-12 md:mt-16">
                    <div className="text-center mb-6 md:mb-8">
                      <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 md:mb-3">
                        Zero-Proof Creations
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                        Sophisticated non-alcoholic beverages crafted with the same attention to detail
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {zeroProofCocktails.map((dish) => (
                        <div 
                          key={dish.id} 
                          className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >
                          {/* Image Container - Empty or with uploaded image */}
                          <div className="w-full h-48 bg-muted/30 relative">
                            {dish.imageUrl && (
                              <Image
                                src={dish.imageUrl}
                                alt={dish.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          
                          <div className="p-5 md:p-6">
                            <div className="flex items-start justify-between mb-2 md:mb-3">
                              <h3 className="font-serif text-xl md:text-2xl font-semibold flex-1">{dish.name}</h3>
                              <span className="text-sm font-medium text-[#C08552] ml-3 whitespace-nowrap">
                                {dish.price}
                              </span>
                            </div>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{dish.description}</p>
                            {!dish.isAvailable && (
                              <p className="text-xs text-red-600 mt-2">Currently unavailable</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      })}

      {/* Empty State */}
      {!isLoading && dishes.length === 0 && (
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <ChefHat className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold mb-2 text-muted-foreground">
                Menu Coming Soon
              </h3>
              <p className="text-muted-foreground">
                Our culinary team is preparing an amazing menu for you. Check back soon!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Dining Experience */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              The Complete Experience
            </h2>
            <p className="text-lg sm:text-xl mb-6 md:mb-8 text-primary-foreground/90 leading-relaxed">
              Beyond our signature dishes, we offer an extensive selection of appetizers, breads, rice preparations, and desserts. Our beverage program includes an impressive wine list, local craft beers, and a comprehensive cocktail menu designed to complement your meal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-8 md:mt-12">
              <div className="bg-primary-foreground/10 p-5 md:p-6 rounded-lg backdrop-blur-sm">
                <h3 className="font-serif text-lg md:text-xl font-semibold mb-2">Dietary Options</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Vegetarian, vegan, and gluten-free options available. Please inform your server of any dietary restrictions.
                </p>
              </div>
              <div className="bg-primary-foreground/10 p-5 md:p-6 rounded-lg backdrop-blur-sm">
                <h3 className="font-serif text-lg md:text-xl font-semibold mb-2">Spice Levels</h3>
                <p className="text-primary-foreground/80 text-sm">
                  All dishes can be customized to your preferred spice level, from mild to extra hot.
                </p>
              </div>
              <div className="bg-primary-foreground/10 p-5 md:p-6 rounded-lg backdrop-blur-sm">
                <h3 className="font-serif text-lg md:text-xl font-semibold mb-2">Pairing Guidance</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Our staff is trained to recommend perfect wine and cocktail pairings for your selections.
                </p>
              </div>
            </div>
            <div className="mt-8 md:mt-12">
              <a
                href="/contact"
                className="button-slide inline-block bg-accent text-accent-foreground px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Reserve Your Table
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