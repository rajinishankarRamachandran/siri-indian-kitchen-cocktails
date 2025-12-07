"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Plus, Edit, Trash2, LogOut, ChefHat, FileText, Upload, Image as ImageIcon, Calendar, Bell, Check, X, Users, Clock, Mail, Phone, Globe, Save } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

type Dish = {
  id: number
  name: string
  description: string
  category: string
  price: string
  imageUrl: string | null
  isAvailable: boolean
  style: string | null
  createdAt: string
  updatedAt: string
}

type Content = {
  id: number
  section: string
  title: string
  description: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

type Reservation = {
  id: number
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  message: string | null
  status: 'pending' | 'accepted' | 'cancelled'
  createdAt: string
  updatedAt: string
}

type PageContent = {
  id: number
  page: string
  section: string
  contentType: string
  fieldName: string
  fieldValue: string | null
  displayOrder: number
  createdAt: string
  updatedAt: string
}

type Tab = "dishes" | "content" | "images" | "reservations" | "website"

export default function AdminPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("reservations")
  const [dishes, setDishes] = useState<Dish[]>([])
  const [content, setContent] = useState<Content[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [previousPendingCount, setPreviousPendingCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showDishForm, setShowDishForm] = useState(false)
  const [showContentForm, setShowContentForm] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingContentImage, setUploadingContentImage] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'cancelled'>('all')
  
  // Website CMS state
  const [pageContents, setPageContents] = useState<PageContent[]>([])
  const [selectedPage, setSelectedPage] = useState<string>("home")
  const [editingField, setEditingField] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [uploadingFieldImage, setUploadingFieldImage] = useState<number | null>(null)
  
  // Cancellation dialog state
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancellingReservation, setCancellingReservation] = useState<Reservation | null>(null)
  const [alternativeTimes, setAlternativeTimes] = useState<string[]>([""])

  // Dish form state
  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    category: "Appetizers",
    price: "",
    imageUrl: "",
    isAvailable: true,
    style: "",
  })

  const [dishImageFileName, setDishImageFileName] = useState("")

  // Content form state
  const [contentForm, setContentForm] = useState({
    section: "hero",
    title: "",
    description: "",
    imageUrl: "",
  })

  const [contentImageFileName, setContentImageFileName] = useState("")

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (session?.user) {
      fetchDishes()
      fetchContent()
      fetchReservations()
      fetchPendingCount()
    }
  }, [session])

  // Poll for new reservations every 10 seconds
  useEffect(() => {
    if (!session?.user) return

    const interval = setInterval(() => {
      fetchPendingCount()
      if (activeTab === 'reservations') {
        fetchReservations()
      }
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
  }, [session, activeTab])

  // Fetch page contents when website tab is active
  useEffect(() => {
    if (activeTab === 'website' && session?.user) {
      fetchPageContents()
    }
  }, [activeTab, selectedPage, session])

  const fetchPageContents = async () => {
    try {
      const response = await fetch(`/api/page-contents?page=${selectedPage}`)
      if (response.ok) {
        const data = await response.json()
        setPageContents(data)
      }
    } catch (error) {
      console.error("Failed to fetch page contents:", error)
    }
  }

  const fetchDishes = async () => {
    try {
      const response = await fetch("/api/dishes")
      if (response.ok) {
        const data = await response.json()
        setDishes(data)
      }
    } catch (error) {
      toast.error("Failed to fetch dishes")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content")
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      }
    } catch (error) {
      toast.error("Failed to fetch content")
    }
  }

  const fetchReservations = async () => {
    const token = localStorage.getItem("bearer_token")
    if (!token) return

    try {
      const url = statusFilter === 'all' 
        ? '/api/reservations'
        : `/api/reservations?status=${statusFilter}`
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error)
    }
  }

  const fetchPendingCount = async () => {
    const token = localStorage.getItem("bearer_token")
    if (!token) return

    try {
      const response = await fetch('/api/reservations/pending-count', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const newCount = data.count
        
        // Show notification if count increased
        if (newCount > previousPendingCount && previousPendingCount > 0) {
          toast.success(`🔔 New reservation received! (${newCount} pending)`, {
            duration: 5000,
          })
          
          // Play notification sound (optional)
          if (typeof Audio !== 'undefined') {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzCH0fPTgjMGHm7A7+OZQQ0PVqzn77BdFgxDmeDyvmkdBCuByvPejzsIGWS67OihTQwNU6fg8LJiFQY7ltHy0Hk=')
            audio.play().catch(() => {}) // Ignore if audio fails
          }
        }
        
        setPreviousPendingCount(pendingCount)
        setPendingCount(newCount)
      }
    } catch (error) {
      console.error("Failed to fetch pending count:", error)
    }
  }

  const handleUpdateReservationStatus = async (id: number, status: 'accepted' | 'cancelled', altTimes?: string[]) => {
    const token = localStorage.getItem("bearer_token")
    if (!token) {
      toast.error("Authentication required")
      return
    }

    try {
      const body: { status: string; alternativeTimes?: string[] } = { status }
      
      // Only include alternative times if they exist and have values
      if (status === 'cancelled' && altTimes) {
        const validTimes = altTimes.filter(t => t.trim() !== '')
        if (validTimes.length > 0) {
          body.alternativeTimes = validTimes
        }
      }

      const response = await fetch(`/api/reservations?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast.success(`Reservation ${status === 'accepted' ? 'accepted' : 'cancelled'} successfully`)
        setShowCancelDialog(false)
        setCancellingReservation(null)
        setAlternativeTimes([""])
        fetchReservations()
        fetchPendingCount()
      } else {
        toast.error(`Failed to ${status} reservation`)
      }
    } catch (error) {
      toast.error(`Failed to ${status} reservation`)
    }
  }

  const openCancelDialog = (reservation: Reservation) => {
    setCancellingReservation(reservation)
    setAlternativeTimes([""])
    setShowCancelDialog(true)
  }

  const addAlternativeTimeField = () => {
    setAlternativeTimes([...alternativeTimes, ""])
  }

  const removeAlternativeTimeField = (index: number) => {
    setAlternativeTimes(alternativeTimes.filter((_, i) => i !== index))
  }

  const updateAlternativeTime = (index: number, value: string) => {
    const newTimes = [...alternativeTimes]
    newTimes[index] = value
    setAlternativeTimes(newTimes)
  }

  // Get all uploaded images from dishes and content
  const getAllImages = () => {
    const dishImages = dishes
      .filter(d => d.imageUrl)
      .map(d => ({ url: d.imageUrl!, name: d.name, type: 'dish' as const, id: d.id }))
    
    const contentImages = content
      .filter(c => c.imageUrl)
      .map(c => ({ url: c.imageUrl!, name: c.title, type: 'content' as const, id: c.id }))
    
    return [...dishImages, ...contentImages]
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setDishForm({ ...dishForm, imageUrl: data.url })
        setDishImageFileName(file.name)
        toast.success("Image uploaded successfully")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to upload image")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    setUploadingContentImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setContentForm({ ...contentForm, imageUrl: data.url })
        setContentImageFileName(file.name)
        toast.success("Image uploaded successfully")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to upload image")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploadingContentImage(false)
    }
  }

  const handleFieldImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    setUploadingFieldImage(itemId)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update the field in the database
        const updateResponse = await fetch(`/api/page-contents?id=${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("bearer_token")}`
          },
          body: JSON.stringify({ 
            fieldValue: data.url
          })
        })

        if (updateResponse.ok) {
          toast.success("Image uploaded successfully")
          fetchPageContents() // Refresh the data
        } else {
          toast.error("Failed to save image URL")
        }
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to upload image")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploadingFieldImage(null)
    }
  }

  const handleSaveField = async (itemId: number) => {
    if (!editValue.trim()) {
      toast.error("Field value cannot be empty")
      return
    }

    try {
      const response = await fetch(`/api/page-contents?id=${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("bearer_token")}`
        },
        body: JSON.stringify({ 
          fieldValue: editValue
        })
      })

      if (response.ok) {
        toast.success("Field updated successfully")
        setEditingField(null)
        setEditValue("")
        fetchPageContents() // Refresh the data
      } else {
        toast.error("Failed to update field")
      }
    } catch (error) {
      toast.error("Failed to update field")
    }
  }

  const handleLogout = async () => {
    const { authClient } = await import("@/lib/auth-client")
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem("bearer_token")
      router.push("/")
    }
  }

  const handleDishSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("bearer_token")

    if (!token) {
      toast.error("Authentication required")
      router.push("/login")
      return
    }

    try {
      const url = editingDish ? `/api/dishes?id=${editingDish.id}` : "/api/dishes"
      const method = editingDish ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dishForm),
      })

      if (response.ok) {
        toast.success(editingDish ? "Dish updated successfully" : "Dish created successfully")
        setShowDishForm(false)
        setEditingDish(null)
        setDishForm({
          name: "",
          description: "",
          category: "Appetizers",
          price: "",
          imageUrl: "",
          isAvailable: true,
          style: "",
        })
        fetchDishes()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save dish")
      }
    } catch (error) {
      toast.error("Failed to save dish")
    }
  }

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("bearer_token")

    if (!token) {
      toast.error("Authentication required")
      router.push("/login")
      return
    }

    try {
      const url = editingContent ? `/api/content?id=${editingContent.id}` : "/api/content"
      const method = editingContent ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contentForm),
      })

      if (response.ok) {
        toast.success(editingContent ? "Content updated successfully" : "Content created successfully")
        setShowContentForm(false)
        setEditingContent(null)
        setContentForm({
          section: "hero",
          title: "",
          description: "",
          imageUrl: "",
        })
        fetchContent()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save content")
      }
    } catch (error) {
      toast.error("Failed to save content")
    }
  }

  const handleDeleteDish = async (id: number) => {
    const token = localStorage.getItem("bearer_token")

    if (!token) {
      toast.error("Authentication required")
      router.push("/login")
      return
    }

    try {
      const response = await fetch(`/api/dishes?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Dish deleted successfully")
        fetchDishes()
      } else {
        toast.error("Failed to delete dish")
      }
    } catch (error) {
      toast.error("Failed to delete dish")
    }
  }

  const handleDeleteContent = async (id: number) => {
    const token = localStorage.getItem("bearer_token")

    if (!token) {
      toast.error("Authentication required")
      router.push("/login")
      return
    }

    try {
      const response = await fetch(`/api/content?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Content deleted successfully")
        fetchContent()
      } else {
        toast.error("Failed to delete content")
      }
    } catch (error) {
      toast.error("Failed to delete content")
    }
  }

  const startEditDish = (dish: Dish) => {
    setEditingDish(dish)
    setDishForm({
      name: dish.name,
      description: dish.description,
      category: dish.category,
      price: dish.price,
      imageUrl: dish.imageUrl || "",
      isAvailable: dish.isAvailable,
      style: dish.style || "",
    })
    setShowDishForm(true)
  }

  const startEditContent = (item: Content) => {
    setEditingContent(item)
    setContentForm({
      section: item.section,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || "",
    })
    setShowContentForm(true)
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("Image URL copied to clipboard")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    if (activeTab === 'reservations') {
      fetchReservations()
    }
  }, [statusFilter, activeTab])

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3E9DC]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#C08552] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#5E3023]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F3E9DC] page-transition">
      {/* Cancellation Dialog */}
      {showCancelDialog && cancellingReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#5E3023] to-[#895737] text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-serif font-bold">Cancel Reservation</h2>
              <p className="text-sm text-[#DAB49D] mt-1">
                {cancellingReservation.name} - {cancellingReservation.date} at {cancellingReservation.time}
              </p>
            </div>
            
            <div className="p-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This will send a cancellation email to <strong>{cancellingReservation.email}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#5E3023] mb-3">
                  Suggest Alternative Times (Optional)
                </label>
                <p className="text-xs text-[#895737] mb-4">
                  Add alternative available times to help the guest reschedule. Format: 6:30 PM, 8:00 PM, 9:30 PM
                </p>
                
                <div className="space-y-3">
                  {alternativeTimes.map((time, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={time}
                        onChange={(e) => updateAlternativeTime(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552] text-sm"
                      />
                      {alternativeTimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAlternativeTimeField(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {alternativeTimes.length < 5 && (
                  <button
                    type="button"
                    onClick={addAlternativeTimeField}
                    className="mt-3 text-sm text-[#C08552] hover:text-[#5E3023] font-medium flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Time
                  </button>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowCancelDialog(false)
                    setCancellingReservation(null)
                    setAlternativeTimes([""])
                  }}
                  className="px-6 py-2.5 bg-[#E8DCC8] text-[#5E3023] rounded-lg hover:bg-[#DAB49D] transition-colors font-medium"
                >
                  Keep Reservation
                </button>
                <button
                  onClick={() => handleUpdateReservationStatus(cancellingReservation.id, 'cancelled', alternativeTimes)}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-[#5E3023] to-[#895737] text-[#F3E9DC] shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/siri-remodel-1764363388439.png?width=8000&height=8000&resize=contain"
                alt="SIRI Logo"
                width={100}
                height={50}
                className="h-10 w-auto brightness-0 invert"
                unoptimized
              />
              <div>
                <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
                <p className="text-sm text-[#DAB49D]">Welcome, {session.user.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#C08552] hover:bg-[#DAB49D] text-[#F3E9DC] px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 border-b border-[#DAB49D] mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("reservations")}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors whitespace-nowrap relative ${
                activeTab === "reservations"
                  ? "text-[#C08552] border-b-2 border-[#C08552]"
                  : "text-[#895737] hover:text-[#C08552]"
              }`}
            >
              <Calendar className="h-5 w-5" />
              Reservations
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("website")}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "website"
                  ? "text-[#C08552] border-b-2 border-[#C08552]"
                  : "text-[#895737] hover:text-[#C08552]"
              }`}
            >
              <Globe className="h-5 w-5" />
              Website CMS
            </button>
            <button
              onClick={() => setActiveTab("dishes")}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "dishes"
                  ? "text-[#C08552] border-b-2 border-[#C08552]"
                  : "text-[#895737] hover:text-[#C08552]"
              }`}
            >
              <ChefHat className="h-5 w-5" />
              Dishes Management
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "content"
                  ? "text-[#C08552] border-b-2 border-[#C08552]"
                  : "text-[#895737] hover:text-[#C08552]"
              }`}
            >
              <FileText className="h-5 w-5" />
              Content Management
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "images"
                  ? "text-[#C08552] border-b-2 border-[#C08552]"
                  : "text-[#895737] hover:text-[#C08552]"
              }`}
            >
              <ImageIcon className="h-5 w-5" />
              Image Library
            </button>
          </div>

          {/* Website CMS Tab */}
          {activeTab === "website" && (
            <div>
              {/* Page selector */}
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-[#5E3023] mb-4">Edit Website Content</h2>
                <div className="flex gap-2 flex-wrap">
                  {['home', 'about', 'experience', 'menu', 'catering', 'contact'].map((page) => (
                    <button
                      key={page}
                      onClick={() => setSelectedPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                        selectedPage === page
                          ? 'bg-[#5E3023] text-[#F3E9DC]'
                          : 'bg-[#E8DCC8] text-[#5E3023] hover:bg-[#DAB49D]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content sections grouped by section */}
              <div className="space-y-6">
                {Object.entries(
                  pageContents.reduce((acc, item) => {
                    if (!acc[item.section]) acc[item.section] = []
                    acc[item.section].push(item)
                    return acc
                  }, {} as Record<string, PageContent[]>)
                ).map(([section, items]) => (
                  <div key={section} className="bg-[#FAF6F0] p-6 rounded-lg border-2 border-[#DAB49D]">
                    <h3 className="text-xl font-serif font-bold text-[#5E3023] mb-4 capitalize">
                      {section.replace(/_/g, ' ')}
                    </h3>
                    
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg border border-[#DAB49D]">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-[#895737] capitalize">
                                  {item.fieldName.replace(/_/g, ' ')}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-[#C08552]/20 text-[#5E3023]">
                                  {item.contentType}
                                </span>
                              </div>
                              
                              {item.contentType === 'image' ? (
                                <div className="space-y-2">
                                  {item.fieldValue && (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                      <Image
                                        src={item.fieldValue}
                                        alt={item.fieldName}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                      />
                                    </div>
                                  )}
                                  <label className="flex items-center gap-2 bg-[#5E3023] text-[#F3E9DC] px-4 py-2 rounded-lg hover:bg-[#895737] transition-colors cursor-pointer w-fit text-sm">
                                    <Upload className="h-4 w-4" />
                                    {uploadingFieldImage === item.id ? "Uploading..." : "Change Image"}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleFieldImageUpload(e, item.id)}
                                      disabled={uploadingFieldImage === item.id}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              ) : (
                                <div>
                                  {editingField === item.id ? (
                                    <div className="flex gap-2">
                                      <textarea
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552] text-sm"
                                        rows={3}
                                      />
                                      <div className="flex flex-col gap-2">
                                        <button
                                          onClick={() => handleSaveField(item.id)}
                                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                          <Save className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingField(null)
                                            setEditValue("")
                                          }}
                                          className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-[#5E3023]">{item.fieldValue || "(Empty)"}</p>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {item.contentType !== 'image' && editingField !== item.id && (
                              <button
                                onClick={() => {
                                  setEditingField(item.id)
                                  setEditValue(item.fieldValue || "")
                                }}
                                className="p-2 text-[#C08552] hover:bg-[#F3E9DC] rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {pageContents.length === 0 && (
                  <div className="text-center py-12 bg-[#FAF6F0] rounded-lg">
                    <Globe className="h-16 w-16 text-[#DAB49D] mx-auto mb-4" />
                    <h3 className="text-lg font-serif font-semibold text-[#5E3023] mb-2">No Content Yet</h3>
                    <p className="text-sm text-[#895737]">Content for this page will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#5E3023]">Reservations</h2>
                  <p className="text-sm text-[#895737] mt-1">
                    {pendingCount} pending {pendingCount === 1 ? 'reservation' : 'reservations'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-[#5E3023] text-[#F3E9DC]'
                        : 'bg-[#E8DCC8] text-[#5E3023] hover:bg-[#DAB49D]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'pending'
                        ? 'bg-[#5E3023] text-[#F3E9DC]'
                        : 'bg-[#E8DCC8] text-[#5E3023] hover:bg-[#DAB49D]'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setStatusFilter('accepted')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'accepted'
                        ? 'bg-[#5E3023] text-[#F3E9DC]'
                        : 'bg-[#E8DCC8] text-[#5E3023] hover:bg-[#DAB49D]'
                    }`}
                  >
                    Accepted
                  </button>
                  <button
                    onClick={() => setStatusFilter('cancelled')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'cancelled'
                        ? 'bg-[#5E3023] text-[#F3E9DC]'
                        : 'bg-[#E8DCC8] text-[#5E3023] hover:bg-[#DAB49D]'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              {/* Reservations List */}
              {reservations.length === 0 ? (
                <div className="text-center py-12 bg-[#FAF6F0] rounded-lg">
                  <Calendar className="h-16 w-16 text-[#DAB49D] mx-auto mb-4" />
                  <h3 className="text-lg font-serif font-semibold text-[#5E3023] mb-2">No Reservations Found</h3>
                  <p className="text-sm text-[#895737]">
                    {statusFilter === 'all' 
                      ? 'No reservations have been made yet' 
                      : `No ${statusFilter} reservations`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {reservations.map((reservation) => (
                    <div 
                      key={reservation.id} 
                      className={`bg-white border-2 rounded-lg p-6 hover:shadow-lg transition-all ${
                        reservation.status === 'pending' 
                          ? 'border-[#C08552] bg-[#C08552]/5' 
                          : reservation.status === 'accepted'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-serif font-bold text-[#5E3023]">
                              {reservation.name}
                            </h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase ${
                              reservation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : reservation.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reservation.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center gap-2 text-sm text-[#895737]">
                              <Calendar className="h-4 w-4 text-[#C08552]" />
                              <span className="font-medium">{reservation.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#895737]">
                              <Clock className="h-4 w-4 text-[#C08552]" />
                              <span className="font-medium">{reservation.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#895737]">
                              <Users className="h-4 w-4 text-[#C08552]" />
                              <span className="font-medium">{reservation.guests} guests</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#895737]">
                              <Phone className="h-4 w-4 text-[#C08552]" />
                              <span className="font-medium">{reservation.phone}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-[#895737] mb-3">
                            <Mail className="h-4 w-4 text-[#C08552]" />
                            <span className="font-medium">{reservation.email}</span>
                          </div>

                          {reservation.message && (
                            <div className="bg-[#FAF6F0] p-3 rounded-lg border border-[#DAB49D] mb-3">
                              <p className="text-sm text-[#5E3023]">
                                <span className="font-semibold">Special Requests:</span> {reservation.message}
                              </p>
                            </div>
                          )}

                          <p className="text-xs text-[#895737]">
                            Submitted: {formatDate(reservation.createdAt)}
                          </p>
                        </div>

                        {reservation.status === 'pending' && (
                          <div className="flex lg:flex-col gap-3">
                            <button
                              onClick={() => handleUpdateReservationStatus(reservation.id, 'accepted')}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              <Check className="h-5 w-5" />
                              Accept
                            </button>
                            <button
                              onClick={() => openCancelDialog(reservation)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              <X className="h-5 w-5" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Dishes Tab */}
          {activeTab === "dishes" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#5E3023]">Dishes</h2>
                <button
                  onClick={() => {
                    setEditingDish(null)
                    setDishForm({
                      name: "",
                      description: "",
                      category: "Appetizers",
                      price: "",
                      imageUrl: "",
                      isAvailable: true,
                      style: "",
                    })
                    setShowDishForm(true)
                  }}
                  className="flex items-center gap-2 bg-[#5E3023] text-[#F3E9DC] px-4 py-2 rounded-lg hover:bg-[#895737] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Dish
                </button>
              </div>

              {/* Dish Form */}
              {showDishForm && (
                <form onSubmit={handleDishSubmit} className="bg-[#FAF6F0] p-6 rounded-lg mb-6 border-2 border-[#C08552]">
                  <h3 className="text-xl font-serif font-bold text-[#5E3023] mb-4">
                    {editingDish ? "Edit Dish" : "Add New Dish"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#5E3023] mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={dishForm.name}
                        onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5E3023] mb-1">Category *</label>
                      <select
                        required
                        value={dishForm.category}
                        onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552]"
                      >
                        <option value="Appetizers">Appetizers</option>
                        <option value="Tawa">Tawa</option>
                        <option value="Grill">Grill</option>
                        <option value="Curry">Curry</option>
                        <option value="Mains">Mains</option>
                        <option value="North Indian">North Indian</option>
                        <option value="South Indian">South Indian</option>
                        <option value="Sides & Accompaniments">Sides & Accompaniments</option>
                        <option value="Cocktails">Cocktails</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5E3023] mb-1">Style</label>
                      <select
                        value={dishForm.style}
                        onChange={(e) => setDishForm({ ...dishForm, style: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552]"
                      >
                        <option value="">None</option>
                        <option value="North Indian">North Indian</option>
                        <option value="South Indian">South Indian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5E3023] mb-1">Price (Format: $15) *</label>
                      <input
                        type="text"
                        required
                        value={dishForm.price}
                        onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5E3023] mb-1">Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={dishForm.description}
                        onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#5E3023] mb-2">Dish Image</label>
                      <div className="flex flex-col gap-3">
                        <label className="flex items-center justify-center gap-2 bg-[#5E3023] text-[#F3E9DC] px-6 py-3 rounded-lg hover:bg-[#895737] transition-colors cursor-pointer w-fit">
                          <Upload className="h-5 w-5" />
                          <span className="font-medium">{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                        
                        {dishForm.imageUrl && dishImageFileName && (
                          <div className="bg-white border-2 border-[#C08552] rounded-lg p-4">
                            <div className="flex items-start gap-4">
                              <div className="relative w-32 h-32 flex-shrink-0">
                                <Image
                                  src={dishForm.imageUrl}
                                  alt="Dish preview"
                                  fill
                                  className="rounded-lg object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Uploaded
                                  </span>
                                </div>
                                <p className="text-base font-semibold text-[#5E3023] mb-1">File: {dishImageFileName}</p>
                                <p className="text-xs text-[#895737] mb-3">Stored in cloud</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDishForm({ ...dishForm, imageUrl: "" })
                                    setDishImageFileName("")
                                  }}
                                  className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                                >
                                  Remove Image
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        checked={dishForm.isAvailable}
                        onChange={(e) => setDishForm({ ...dishForm, isAvailable: e.target.checked })}
                        className="h-4 w-4 text-[#C08552] focus:ring-[#C08552] border-[#DAB49D] rounded"
                      />
                      <label htmlFor="isAvailable" className="text-sm text-[#5E3023]">Available</label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="bg-[#5E3023] text-[#F3E9DC] px-6 py-2 rounded-lg hover:bg-[#895737] transition-colors font-medium"
                    >
                      {editingDish ? "Update Dish" : "Create Dish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDishForm(false)
                        setEditingDish(null)
                      }}
                      className="bg-[#DAB49D] text-[#5E3023] px-6 py-2 rounded-lg hover:bg-[#C08552] hover:text-[#F3E9DC] transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Dishes List */}
              <div className="grid grid-cols-1 gap-4">
                {dishes.map((dish) => (
                  <div key={dish.id} className="bg-white border border-[#DAB49D] rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      {dish.imageUrl && (
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={dish.imageUrl}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-serif font-semibold text-[#5E3023]">{dish.name}</h3>
                          <span className="text-sm font-medium text-[#C08552]">{dish.price}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#DAB49D] text-[#5E3023]">{dish.category}</span>
                          {dish.style && (
                            <span className="text-xs px-2 py-1 rounded-full bg-[#C08552] text-white">{dish.style}</span>
                          )}
                          {!dish.isAvailable && (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Unavailable</span>
                          )}
                        </div>
                        <p className="text-sm text-[#895737]">{dish.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditDish(dish)}
                          className="p-2 text-[#C08552] hover:bg-[#F3E9DC] rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#5E3023]">Website Content</h2>
                <button
                  onClick={() => {
                    setEditingContent(null)
                    setContentForm({
                      section: "hero",
                      title: "",
                      description: "",
                      imageUrl: "",
                    })
                    setShowContentForm(true)
                  }}
                  className="flex items-center gap-2 bg-[#5E3023] text-[#F3E9DC] px-4 py-2 rounded-lg hover:bg-[#895737] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Content
                </button>
              </div>

              {/* Content Form */}
              {showContentForm && (
                <form onSubmit={handleContentSubmit} className="bg-[#FAF6F0] p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-serif font-bold text-[#5E3023] mb-4">
                    {editingContent ? "Edit Content" : "Add New Content"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#5E3023] mb-1">Section *</label>
                      <select
                        required
                        value={contentForm.section}
                        onChange={(e) => setContentForm({ ...contentForm, section: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552]"
                      >
                        <option value="hero">Hero</option>
                        <option value="about">About</option>
                        <option value="experience">Experience</option>
                        <option value="cta">Call to Action</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5E3023] mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={contentForm.title}
                        onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#5E3023] mb-1">Description *</label>
                      <textarea
                        required
                        rows={4}
                        value={contentForm.description}
                        onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DAB49D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C08552]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#5E3023] mb-1">Content Image</label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 bg-[#5E3023] text-[#F3E9DC] px-4 py-2 rounded-lg hover:bg-[#895737] transition-colors cursor-pointer">
                          <Upload className="h-4 w-4" />
                          {uploadingContentImage ? "Uploading..." : "Upload Image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleContentImageUpload}
                            disabled={uploadingContentImage}
                            className="hidden"
                          />
                        </label>
                        {contentForm.imageUrl && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600">✓ Image uploaded</span>
                            <button
                              type="button"
                              onClick={() => setContentForm({ ...contentForm, imageUrl: "" })}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                      {contentForm.imageUrl && (
                        <div className="mt-2">
                          <Image
                            src={contentForm.imageUrl}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="bg-[#5E3023] text-[#F3E9DC] px-6 py-2 rounded-lg hover:bg-[#895737] transition-colors"
                    >
                      {editingContent ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowContentForm(false)
                        setEditingContent(null)
                      }}
                      className="bg-[#DAB49D] text-[#5E3023] px-6 py-2 rounded-lg hover:bg-[#C08552] hover:text-[#F3E9DC] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Content List */}
              <div className="grid grid-cols-1 gap-4">
                {content.map((item) => (
                  <div key={item.id} className="bg-white border border-[#DAB49D] rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-serif font-semibold text-[#5E3023]">{item.title}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#C08552] text-[#F3E9DC]">{item.section}</span>
                        </div>
                        <p className="text-sm text-[#895737]">{item.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditContent(item)}
                          className="p-2 text-[#C08552] hover:bg-[#F3E9DC] rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteContent(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Library Tab */}
          {activeTab === "images" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#5E3023] mb-2">Image Library</h2>
                <p className="text-sm text-[#895737]">All images uploaded to your cloud storage (Supabase)</p>
              </div>

              {getAllImages().length === 0 ? (
                <div className="text-center py-12 bg-[#FAF6F0] rounded-lg">
                  <ImageIcon className="h-16 w-16 text-[#DAB49D] mx-auto mb-4" />
                  <h3 className="text-lg font-serif font-semibold text-[#5E3023] mb-2">No Images Yet</h3>
                  <p className="text-sm text-[#895737]">Upload images in the Dishes or Content sections to see them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getAllImages().map((img, index) => (
                    <div key={`${img.type}-${img.id}-${index}`} className="bg-white border border-[#DAB49D] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative w-full h-48">
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-[#5E3023] mb-1 truncate">{img.name}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#DAB49D] text-[#5E3023]">
                          {img.type === 'dish' ? 'Dish' : 'Content'}
                        </span>
                        <button
                          onClick={() => copyImageUrl(img.url)}
                          className="mt-2 w-full text-xs text-[#C08552] hover:text-[#895737] font-medium py-1.5 px-2 border border-[#C08552] rounded hover:bg-[#F3E9DC] transition-colors"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}