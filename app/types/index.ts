export type CycleFrequency = "3days" | "1week" | "2weeks" | "1month"

export type Member = {
  id: string
  name: string
  avatar: string
  hasContributed: boolean
  hasReceived: boolean
  nextReceiveDate?: string
}

export type Message = {
  id: string
  sender: Member
  content: string
  timestamp: string
  type: "message" | "system" | "contribution"
}

export type Group = {
  id: string
  name: string
  contributionAmount: number
  totalMembers: number
  cycleFrequency: CycleFrequency
  currentRound: number
  totalRounds: number
  startDate: string
  nextContributionDate: string
  members: Member[]
  messages: Message[]
  currentRecipientId: string
  nextRecipientId: string
}

