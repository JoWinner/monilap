"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

type Notification = {
  id: string
  title: string
  message: string
  timestamp: string
  type: "contribution" | "received" | "reminder" | "system"
  isRead: boolean
}

// Dummy notifications data
const notifications: Notification[] = [
  {
    id: "1",
    title: "New Contribution",
    message: "Sarah has contributed $500 to Summer Trip 2024 🌴",
    timestamp: "2024-02-01T10:00:00Z",
    type: "contribution",
    isRead: false,
  },
  {
    id: "2",
    title: "Your Turn to Receive",
    message: "It's your turn to receive funds in Tech Fund 📱",
    timestamp: "2024-02-01T09:30:00Z",
    type: "received",
    isRead: false,
  },
  {
    id: "3",
    title: "Contribution Reminder",
    message: "Don't forget to contribute to Summer Trip 2024 🌴 by tomorrow",
    timestamp: "2024-02-01T08:00:00Z",
    type: "reminder",
    isRead: true,
  },
  {
    id: "4",
    title: "New Group Cycle",
    message: "Tech Fund 📱 has started a new contribution cycle",
    timestamp: "2024-01-31T15:00:00Z",
    type: "system",
    isRead: true,
  },
]

export default function NotificationsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-muted">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-semibold">Notifications</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="space-y-4"
        >
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`p-4 rounded-xl bg-white card-shadow ${!notification.isRead ? "border-l-4 border-primary" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleDateString()} at{" "}
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {!notification.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}

