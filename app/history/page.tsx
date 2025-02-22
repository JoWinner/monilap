"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAppContext } from "../context/AppContext"
import { motion } from "framer-motion"

type Transaction = {
  id: string
  type: "contribution" | "received"
  amount: number
  groupName: string
  date: string
  status: "completed" | "pending"
}

export default function HistoryPage() {
  const router = useRouter()
  const { groups } = useAppContext()

  // Generate transaction history from groups data
  const transactions: Transaction[] = groups.flatMap((group) => {
    const contributions = group.members
      .filter((member) => member.name === "You" && member.hasContributed)
      .map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        type: "contribution" as const,
        amount: group.contributionAmount,
        groupName: group.name,
        date: new Date().toISOString(),
        status: "completed" as const,
      }))

    const received = group.members
      .filter((member) => member.name === "You" && member.hasReceived)
      .map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        type: "received" as const,
        amount: group.contributionAmount * group.members.length,
        groupName: group.name,
        date: new Date().toISOString(),
        status: "completed" as const,
      }))

    return [...contributions, ...received]
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-muted">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl">Transaction History</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="space-y-6">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 card-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "contribution"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary/10 text-secondary-dark"
                    }`}
                  >
                    {transaction.type === "contribution" ? "↑" : "↓"}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.groupName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()} at{" "}
                      {new Date(transaction.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg ${
                      transaction.type === "contribution" ? "text-primary" : "text-secondary-dark"
                    }`}
                  >
                    {transaction.type === "contribution" ? "-" : "+"}${transaction.amount}
                  </p>
                  <p className={`text-sm ${transaction.status === "completed" ? "text-green-600" : "text-amber-600"}`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

