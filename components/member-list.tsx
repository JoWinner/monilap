import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Member } from "@/app/types"

interface MemberListProps {
  members: Member[]
  totalMembers: number
}

export function MemberList({ members, totalMembers }: MemberListProps) {
  return (
    <div className="space-y-3">
      {members.map((member, i) => (
        <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">{member.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">
                {member.hasReceived ? "Received" : member.hasContributed ? "Contributed" : "Pending"}
              </p>
            </div>
          </div>
          <div className="text-sm font-medium text-primary">{((1 / totalMembers) * 100).toFixed(0)}%</div>
        </div>
      ))}
    </div>
  )
}

