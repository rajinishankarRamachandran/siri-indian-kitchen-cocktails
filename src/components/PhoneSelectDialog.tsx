"use client"

import { useState } from "react"
import { Phone, Copy, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const phoneNumbers = [
  {
    name: "Neeraj Shokeen",
    number: "+1 (848) 260-8267",
    tel: "+18482608267"
  },
  {
    name: "Amit",
    number: "+1 (201) 214-0953",
    tel: "+12012140953"
  }
]

export function PhoneSelectDialog({ children }: { children: React.ReactNode }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (number: string, index: number) => {
    try {
      await navigator.clipboard.writeText(number)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Contact Us for Events</DialogTitle>
          <DialogDescription>
            Choose a contact person to call or copy their number
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {phoneNumbers.map((contact, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-base">{contact.name}</h4>
                  <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${contact.tel}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                <button
                  onClick={() => handleCopy(contact.number, index)}
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-4 py-2.5 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                >
                  {copiedIndex === index ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
