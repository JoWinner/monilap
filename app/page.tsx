"use client"

import { Bell, Clock, Plus, Users, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAppContext } from "./context/AppContext"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

export default function HomePage() {
  const router = useRouter()
  const { groups, createGroup } = useAppContext()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupAmount, setNewGroupAmount] = useState("")
  const [newGroupFrequency, setNewGroupFrequency] = useState("2weeks")
  const [newGroupMembers, setNewGroupMembers] = useState("")

  const handleCreateGroup = () => {
    createGroup(
      newGroupName,
      Number.parseFloat(newGroupAmount),
      newGroupFrequency as "3days" | "1week" | "2weeks" | "1month",
      Number.parseInt(newGroupMembers),
    )
    setIsCreateModalOpen(false)
    setNewGroupName("")
    setNewGroupAmount("")
    setNewGroupFrequency("2weeks")
    setNewGroupMembers("")
  }

  // Calculate totals
  const totalContributed = groups.reduce((sum, group) => {
    const userContributions = group.members.find((m) => m.name === "You")?.hasContributed ? group.contributionAmount : 0
    return sum + userContributions
  }, 0)

  const totalReceived = groups.reduce((sum, group) => {
    const userReceived = group.members.find((m) => m.name === "You")?.hasReceived
      ? group.contributionAmount * group.members.length
      : 0
    return sum + userReceived
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-medium">MoneyCircle</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Alex</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-6 h-6 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-32 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 card-shadow"
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Contributed</p>
              <p className="text-2xl font-medium text-primary">${totalContributed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Received</p>
              <p className="text-2xl font-medium text-secondary-dark">${totalReceived}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => router.push("/history")}>
            <Clock className="w-4 h-4 mr-2" />
            View History
          </Button>
        </motion.div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Active Groups</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              See All
            </Button>
          </div>

          <motion.div
            className="space-y-4"
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
          >
            {groups.map((group) => (
              <motion.div
                key={group.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href={`/groups/${group.id}`}>
                  <div className="bg-white rounded-xl p-4 card-shadow hover:shadow-glow transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.members.length} members</p>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-dark">
                        Active
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          ${group.contributionAmount * group.currentRound} / $
                          {group.contributionAmount * group.totalRounds}
                        </span>
                      </div>
                      <Progress value={(group.currentRound / group.totalRounds) * 100} className="h-2 bg-muted">
                        <div className="h-full bg-primary rounded-full" />
                      </Progress>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 4).map((member, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
                            >
                              {member.name[0]}
                            </div>
                          ))}
                          {group.members.length > 4 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-muted flex items-center justify-center text-xs">
                              +{group.members.length - 4}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Next: {new Date(group.nextContributionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Button
                variant="outline"
                className="w-full h-20 rounded-xl border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-6 h-6 mr-2" />
                Create New Group
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-border">
        <div className="max-w-xl mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            <Link href="/">
              <Button variant="ghost" className="flex flex-col items-center text-primary">
                <Wallet className="w-5 h-5" />
                <span className="text-xs mt-1">Home</span>
              </Button>
            </Link>
            <Link href="/groups">
              <Button variant="ghost" className="flex flex-col items-center text-muted-foreground">
                <Users className="w-5 h-5" />
                <span className="text-xs mt-1">Groups</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="flex flex-col items-center text-muted-foreground">
                <Plus className="w-5 h-5" />
                <span className="text-xs mt-1">Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>Set up a new savings group with your friends.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={newGroupAmount}
                onChange={(e) => setNewGroupAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <Select value={newGroupFrequency} onValueChange={setNewGroupFrequency}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3days">Every 3 days</SelectItem>
                  <SelectItem value="1week">Weekly</SelectItem>
                  <SelectItem value="2weeks">Bi-weekly</SelectItem>
                  <SelectItem value="1month">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="members" className="text-right">
                Members
              </Label>
              <Input
                id="members"
                type="number"
                value={newGroupMembers}
                onChange={(e) => setNewGroupMembers(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateGroup} className="bg-gradient-primary hover:opacity-90 text-white">
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

