import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterSelectProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function FilterSelect({ label, value, onValueChange, options }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

