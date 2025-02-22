"use client"

import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Message } from "@/app/types"
import { useState } from "react"

interface ChatWindowProps {
  messages: (Message & { isPinned?: boolean })[]
  onSendMessage: (content: string) => void
  onContribute?: () => void
}

export function ChatWindow({ messages, onSendMessage, onContribute }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const pinnedMessages = messages.filter((m) => m.isPinned)
  const regularMessages = messages.filter((m) => !m.isPinned)

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
        {pinnedMessages.length > 0 && (
          <div className="bg-muted/50 p-4 rounded-xl mb-4 space-y-2">
            {pinnedMessages.map((message, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-primary font-medium">📌 Pinned Message</p>
                  <p className="text-sm">{message.content}</p>
                </div>
                {onContribute && (
                  <Button onClick={onContribute} className="ml-4 bg-primary text-white">
                    Contribute
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {regularMessages.map((message, i) => (
          <div key={i} className={`flex flex-col ${message.sender.name === "You" ? "items-end" : "items-start"}`}>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-muted-foreground">{message.sender.name}</p>
              <p className="text-xs text-muted-foreground">{new Date(message.timestamp).toLocaleTimeString()}</p>
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender.name === "You" ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow"
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} className="bg-primary text-white">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

