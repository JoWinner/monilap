"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAppContext } from "../../context/AppContext"

export default function ContributePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { groups, contribute } = useAppContext()
  const [amount, setAmount] = useState("100.00")

  const group = groups.find((g) => g.id === params.id)

  if (!group) {
    return <div>Group not found</div>
  }

  const handleNumberClick = (num: string) => {
    if (num === "←") {
      setAmount((prev) => prev.slice(0, -1) || "0.00")
    } else if (num === ".") {
      if (!amount.includes(".")) {
        setAmount((prev) => prev + ".")
      }
    } else {
      setAmount((prev) => {
        const [whole, decimal] = prev.split(".")
        if (!decimal) return prev + num
        if (decimal.length < 2) return `${whole}.${decimal}${num}`
        return prev
      })
    }
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value.toFixed(2))
  }

  const handleContribute = () => {
    contribute(group.id, Number.parseFloat(amount))
    router.push(`/groups/${group.id}`)
  }

  return (
    <div className="pb-20">
      <header className="p-4 flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">Make Contribution</h1>
      </header>

      <main className="p-4">
        <div className="text-center mb-8">
          <p className="text-gray-400 mb-2">Contributing to</p>
          <h2 className="text-2xl font-bold">{group.name}</h2>
        </div>

        <div className="text-center mb-8">
          <div className="text-5xl font-bold mb-4 flex items-center justify-center">
            <span className="text-3xl mr-2">$</span>
            <span>{amount.split(".")[0]}</span>
            <span className="text-gray-500">.{amount.split(".")[1] || "00"}</span>
          </div>
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {[10, 25, 50, 100, 200].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                className="border-zinc-800 hover:border-yellow-400 hover:bg-yellow-400/10 text-gray-400 hover:text-yellow-400"
                onClick={() => handleQuickAmount(quickAmount)}
              >
                ${quickAmount}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "←"].map((num) => (
            <Button
              key={num}
              variant="ghost"
              className="h-16 text-2xl font-semibold hover:bg-zinc-800"
              onClick={() => handleNumberClick(num.toString())}
            >
              {num}
            </Button>
          ))}
        </div>

        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black h-14 text-lg" onClick={handleContribute}>
          Contribute Now
        </Button>
      </main>
    </div>
  )
}

