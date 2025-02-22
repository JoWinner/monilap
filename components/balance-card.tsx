import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface BalanceCardProps {
  balance: number
  target: number
  onContribute: () => void
}

export function BalanceCard({ balance, target, onContribute }: BalanceCardProps) {
  const progress = (balance / target) * 100

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-muted-foreground mb-1">Group Balance</p>
          <h2 className="text-4xl font-bold">${balance.toFixed(2)}</h2>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground mb-1">Target</p>
          <p className="text-2xl font-semibold">${target.toFixed(2)}</p>
        </div>
      </div>
      <Progress value={progress} className="h-3 mb-6 bg-muted">
        <div className="h-full bg-primary rounded-full" />
      </Progress>
      <Button className="w-full bg-primary text-white hover:opacity-90 transition-opacity" onClick={onContribute}>
        Make Contribution
      </Button>
    </div>
  )
}

