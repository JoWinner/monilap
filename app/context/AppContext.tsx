"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Group, Member, CycleFrequency } from "../types"

type AppContextType = {
  groups: Group[]
  createGroup: (name: string, amount: number, frequency: CycleFrequency, totalMembers: number) => void
  addMember: (groupId: string, member: Member) => void
  contribute: (groupId: string, memberId: string) => void
  sendMessage: (groupId: string, content: string, type: "message" | "system" | "contribution") => void
  completeCurrentCycle: (groupId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "summer-trip",
      name: "Summer Trip 2024 🌴",
      contributionAmount: 500,
      totalMembers: 6,
      cycleFrequency: "2weeks",
      currentRound: 3,
      totalRounds: 6,
      startDate: "2024-01-01T00:00:00Z",
      nextContributionDate: "2024-02-15T00:00:00Z",
      members: [
        {
          id: "1",
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: true,
          hasReceived: false,
        },
        {
          id: "2",
          name: "Sarah",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: true,
          hasReceived: true,
        },
        {
          id: "3",
          name: "Mike",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: false,
          hasReceived: false,
        },
        {
          id: "4",
          name: "Emma",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: true,
          hasReceived: true,
        },
        {
          id: "5",
          name: "James",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: false,
          hasReceived: false,
        },
        {
          id: "6",
          name: "Lisa",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: true,
          hasReceived: false,
        },
      ],
      messages: [
        {
          id: "m1",
          sender: {
            id: "1",
            name: "You",
            avatar: "/placeholder.svg?height=40&width=40",
            hasContributed: true,
            hasReceived: false,
          },
          content: "Just contributed my share! 💸",
          timestamp: "2024-02-01T10:00:00Z",
          type: "contribution",
        },
        {
          id: "m2",
          sender: {
            id: "2",
            name: "Sarah",
            avatar: "/placeholder.svg?height=40&width=40",
            hasContributed: true,
            hasReceived: true,
          },
          content: "Thanks everyone! Got my payout for Round 2! 🎉",
          timestamp: "2024-02-01T10:05:00Z",
          type: "system",
        },
        {
          id: "m3",
          sender: {
            id: "6",
            name: "Lisa",
            avatar: "/placeholder.svg?height=40&width=40",
            hasContributed: true,
            hasReceived: false,
          },
          content: "Can't wait for the trip! Already planning what to pack 🧳",
          timestamp: "2024-02-01T10:10:00Z",
          type: "message",
        },
      ],
      currentRecipientId: "3",
      nextRecipientId: "5",
    },
    {
      id: "new-gadgets",
      name: "Tech Fund 📱",
      contributionAmount: 200,
      totalMembers: 4,
      cycleFrequency: "1month",
      currentRound: 2,
      totalRounds: 4,
      startDate: "2024-01-15T00:00:00Z",
      nextContributionDate: "2024-02-15T00:00:00Z",
      members: [
        {
          id: "1",
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: true,
          hasReceived: true,
        },
        {
          id: "7",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: true,
          hasReceived: false,
        },
        {
          id: "8",
          name: "Jordan",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: false,
          hasReceived: false,
        },
        {
          id: "9",
          name: "Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: true,
          hasReceived: false,
        },
      ],
      messages: [
        {
          id: "m4",
          sender: {
            id: "1",
            name: "You",
            avatar: "/placeholder.svg?height=40&width=40",
            hasContributed: true,
            hasReceived: true,
          },
          content: "Got my new iPhone! Thanks everyone! 📱",
          timestamp: "2024-01-20T15:00:00Z",
          type: "system",
        },
        {
          id: "m5",
          sender: {
            id: "7",
            name: "Alex",
            avatar: "/placeholder.svg?height=40&width=40",
            hasContributed: true,
            hasReceived: false,
          },
          content: "Nice! I'm thinking of getting the new Samsung when it's my turn",
          timestamp: "2024-01-20T15:05:00Z",
          type: "message",
        },
      ],
      currentRecipientId: "7",
      nextRecipientId: "8",
    },
  ])

  // Calculate next contribution date based on frequency
  const getNextContributionDate = (frequency: CycleFrequency) => {
    const date = new Date()
    switch (frequency) {
      case "3days":
        date.setDate(date.getDate() + 3)
        break
      case "1week":
        date.setDate(date.getDate() + 7)
        break
      case "2weeks":
        date.setDate(date.getDate() + 14)
        break
      case "1month":
        date.setMonth(date.getMonth() + 1)
        break
    }
    return date.toISOString()
  }

  const createGroup = (name: string, amount: number, frequency: CycleFrequency, totalMembers: number) => {
    const newGroup: Group = {
      id: Math.random().toString(36).substring(7),
      name,
      contributionAmount: amount,
      totalMembers,
      cycleFrequency: frequency,
      currentRound: 1,
      totalRounds: totalMembers,
      startDate: new Date().toISOString(),
      nextContributionDate: getNextContributionDate(frequency),
      members: [
        {
          id: "1",
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          hasContributed: false,
          hasReceived: false,
        },
      ],
      messages: [],
      currentRecipientId: "1",
      nextRecipientId: "",
    }
    setGroups((prev) => [...prev, newGroup])
  }

  const addMember = (groupId: string, member: Member) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            members: [...group.members, member],
          }
        }
        return group
      }),
    )
  }

  const contribute = (groupId: string, memberId: string) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          const updatedMembers = group.members.map((member) => {
            if (member.id === memberId) {
              return { ...member, hasContributed: true }
            }
            return member
          })

          // Check if all members have contributed
          const allContributed = updatedMembers.every((member) => member.hasContributed)

          if (allContributed) {
            // Reset contributions and update recipient
            updatedMembers.forEach((member) => {
              member.hasContributed = false
            })
            const currentRecipient = updatedMembers.find((m) => m.id === group.currentRecipientId)
            if (currentRecipient) {
              currentRecipient.hasReceived = true
            }

            // Find next recipient
            const nextRecipient = updatedMembers.find((m) => !m.hasReceived)

            return {
              ...group,
              members: updatedMembers,
              currentRound: nextRecipient ? group.currentRound + 1 : group.currentRound,
              currentRecipientId: nextRecipient?.id || group.currentRecipientId,
              nextContributionDate: getNextContributionDate(group.cycleFrequency),
              messages: [
                ...group.messages,
                {
                  id: Math.random().toString(36).substring(7),
                  sender: updatedMembers[0],
                  content: `Round ${group.currentRound} completed! ${currentRecipient?.name} received the pool.`,
                  timestamp: new Date().toISOString(),
                  type: "system",
                },
              ],
            }
          }

          return {
            ...group,
            members: updatedMembers,
            messages: [
              ...group.messages,
              {
                id: Math.random().toString(36).substring(7),
                sender: updatedMembers.find((m) => m.id === memberId)!,
                content: `Contributed $${group.contributionAmount}`,
                timestamp: new Date().toISOString(),
                type: "contribution",
              },
            ],
          }
        }
        return group
      }),
    )
  }

  const sendMessage = (groupId: string, content: string, type: "message" | "system" | "contribution" = "message") => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            messages: [
              ...group.messages,
              {
                id: Math.random().toString(36).substring(7),
                sender: group.members[0], // Current user
                content,
                timestamp: new Date().toISOString(),
                type,
              },
            ],
          }
        }
        return group
      }),
    )
  }

  const completeCurrentCycle = (groupId: string) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId && group.currentRound === group.totalRounds) {
          return {
            ...group,
            messages: [
              ...group.messages,
              {
                id: Math.random().toString(36).substring(7),
                sender: group.members[0],
                content: "🎉 Group savings cycle completed! All members have received their turn.",
                timestamp: new Date().toISOString(),
                type: "system",
              },
            ],
          }
        }
        return group
      }),
    )
  }

  return (
    <AppContext.Provider
      value={{
        groups,
        createGroup,
        addMember,
        contribute,
        sendMessage,
        completeCurrentCycle,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

