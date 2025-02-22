"use client"

import type React from "react"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState({
    firstName: "",
    surname: "",
    nickname: "",
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
  })

  const handleChange = (field: keyof typeof profile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save profile data
    console.log("Profile data:", profile)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-muted">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-semibold">Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Personal Information</h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name (as on ID)</Label>
                  <Input id="firstName" value={profile.firstName} onChange={handleChange("firstName")} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname">Surname (as on ID)</Label>
                  <Input id="surname" value={profile.surname} onChange={handleChange("surname")} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input id="nickname" value={profile.nickname} onChange={handleChange("nickname")} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-medium">Contact Information</h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="primaryPhone">Primary Phone Number</Label>
                  <Input
                    id="primaryPhone"
                    type="tel"
                    value={profile.primaryPhone}
                    onChange={handleChange("primaryPhone")}
                    required
                  />
                  <p className="text-sm text-muted-foreground">This is the number registered with your account</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="secondaryPhone">Secondary Phone Number (Optional)</Label>
                  <Input
                    id="secondaryPhone"
                    type="tel"
                    value={profile.secondaryPhone}
                    onChange={handleChange("secondaryPhone")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input id="email" type="email" value={profile.email} onChange={handleChange("email")} />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary text-white">
              Save Profile
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}

