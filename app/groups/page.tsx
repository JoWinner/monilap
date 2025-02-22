"use client"

import { ArrowLeft, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAppContext } from "../context/AppContext"
import { motion } from "framer-motion"
import { SearchBar } from "@/components/search-bar"
import { FilterSelect } from "@/components/filter-select"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { GroupCard } from "@/components/group-card"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
}

export default function GroupsPage() {
  const router = useRouter()
  const { groups } = useAppContext()
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({
    members: "all",
    amount: "all",
    status: "all",
    turn: "all",
  })

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(search.toLowerCase())
    const matchesMembers =
      filters.members === "all" || (filters.members === "less-5" ? group.members.length < 5 : group.members.length >= 5)
    const matchesAmount =
      filters.amount === "all" ||
      (filters.amount === "less-1000"
        ? group.contributionAmount * group.totalRounds < 1000
        : group.contributionAmount * group.totalRounds >= 1000)
    const matchesStatus =
      filters.status === "all" || (filters.status === "active" && group.currentRound < group.totalRounds)
    const matchesTurn =
      filters.turn === "all" ||
      (filters.turn === "receive"
        ? group.currentRecipientId === "1"
        : filters.turn === "contribute"
          ? !group.members.find((m) => m.id === "1")?.hasContributed
          : true)

    return matchesSearch && matchesMembers && matchesAmount && matchesStatus && matchesTurn
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-muted">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold">My Groups</h1>
          </div>
          <div className="flex items-center gap-2">
            <SearchBar value={search} onChange={setSearch} placeholder="Search groups..." />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Groups</SheetTitle>
                  <SheetDescription>Customize your group view</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <FilterSelect
                    label="Members"
                    value={filters.members}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, members: value }))}
                    options={[
                      { value: "less-5", label: "Less than 5" },
                      { value: "more-5", label: "5 or more" },
                    ]}
                  />
                  <FilterSelect
                    label="Target Amount"
                    value={filters.amount}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, amount: value }))}
                    options={[
                      { value: "less-1000", label: "Less than $1000" },
                      { value: "more-1000", label: "$1000 or more" },
                    ]}
                  />
                  <FilterSelect
                    label="Status"
                    value={filters.status}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "closed", label: "Closed" },
                    ]}
                  />
                  <FilterSelect
                    label="Turn"
                    value={filters.turn}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, turn: value }))}
                    options={[
                      { value: "receive", label: "My Turn to Receive" },
                      { value: "contribute", label: "Need to Contribute" },
                    ]}
                  />
                </div>
                <SheetFooter>
                  <Button
                    onClick={() =>
                      setFilters({
                        members: "all",
                        amount: "all",
                        status: "all",
                        turn: "all",
                      })
                    }
                    variant="outline"
                  >
                    Reset Filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8">
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6">
          {filteredGroups.map((group) => (
            <motion.div key={group.id} variants={item}>
              <GroupCard group={group} />
            </motion.div>
          ))}

          <motion.div variants={item}>
            <Button
              variant="outline"
              className="w-full h-24 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={() => router.push("/create")}
            >
              <Plus className="w-6 h-6 mr-2" />
              Create New Group
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

