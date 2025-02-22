import { Progress } from "@/components/ui/progress"
import type { Group } from "@/app/types"
import Link from "next/link"

interface GroupCardProps {
  group: Group
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`}>
      <div className="bg-white rounded-xl p-4 card-shadow hover:shadow-glow transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium">{group.name}</h3>
            <p className="text-sm text-muted-foreground">{group.members.length} members</p>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-dark">Active</div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              ${group.contributionAmount * group.currentRound} / ${group.contributionAmount * group.totalRounds}
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
  )
}

