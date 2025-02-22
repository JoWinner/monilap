"use client"

import { ArrowLeft, Share2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAppContext } from "../../context/AppContext"
import { useState } from "react"
import { motion } from "framer-motion"
import { ChatWindow } from "@/components/chat-window"
import { SearchBar } from "@/components/search-bar"
import { FilterSelect } from "@/components/filter-select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function GroupDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { groups, sendMessage, contribute } = useAppContext()
  const [memberSearch, setMemberSearch] = useState("")
  const [memberFilter, setMemberFilter] = useState("all")
  const [groupNote, setGroupNote] = useState("")
  const [isFullscreenChat, setIsFullscreenChat] = useState(false)

  const group = groups.find((g) => g.id === params.id)

  if (!group) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-muted-foreground">Group not found</h2>
        <Button className="mt-4" onClick={() => router.push("/groups")}>
          Back to Groups
        </Button>
      </div>
    )
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Join our ${group.name} savings group!`,
        text: `Join our ${group.name} savings group on GroupSave`,
        url: window.location.href,
      })
    } catch (err) {
      console.log("Error sharing:", err)
    }
  }

  const handleContribute = () => {
    router.push(`/contribute/${group.id}`)
  }

  const filteredMembers = group.members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(memberSearch.toLowerCase())
    if (memberFilter === "all") return matchesSearch
    if (memberFilter === "contributed") return matchesSearch && member.hasContributed
    if (memberFilter === "received") return matchesSearch && member.hasReceived
    if (memberFilter === "pending") return matchesSearch && !member.hasContributed && !member.hasReceived
    return matchesSearch
  })

  // Create a pinned balance message
  const balanceMessage = {
    id: "balance",
    sender: {
      id: "system",
      name: "System",
      avatar: "/placeholder.svg?height=40&width=40",
      hasContributed: false,
      hasReceived: false,
    },
    content: `📊 Group Balance: $${(group.contributionAmount * group.currentRound).toFixed(2)} / $${(
      group.contributionAmount * group.totalRounds
    ).toFixed(2)}`,
    timestamp: new Date().toISOString(),
    type: "system" as const,
    isPinned: true,
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()} className="hover:bg-muted">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-bold">{group.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleShare} className="hover:bg-muted">
                <Share2 className="w-5 h-5" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-muted">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Group Details</SheetTitle>
                    <SheetDescription>Manage group members and notes</SheetDescription>
                  </SheetHeader>
                  <Tabs defaultValue="members" className="mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="members">Members</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="members" className="space-y-4">
                      <SearchBar value={memberSearch} onChange={setMemberSearch} placeholder="Search members..." />
                      <FilterSelect
                        label="Status"
                        value={memberFilter}
                        onValueChange={setMemberFilter}
                        options={[
                          { value: "contributed", label: "Contributed" },
                          { value: "received", label: "Received" },
                          { value: "pending", label: "Pending" },
                        ]}
                      />
                      <div className="space-y-3 mt-4">
                        {filteredMembers.map((member, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                {member.name[0]}
                              </div>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {member.hasReceived ? "Received" : member.hasContributed ? "Contributed" : "Pending"}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-primary">
                              {((1 / group.totalMembers) * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="notes">
                      <Textarea
                        placeholder="Add group notes here..."
                        value={groupNote}
                        onChange={(e) => setGroupNote(e.target.value)}
                        className="min-h-[200px]"
                      />
                    </TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <motion.div layout className="space-y-6">
          <ChatWindow
            messages={[balanceMessage, ...group.messages]}
            onSendMessage={(content) => sendMessage(group.id, content)}
            onContribute={handleContribute}
          />
        </motion.div>
      </main>
    </div>
  )
}

