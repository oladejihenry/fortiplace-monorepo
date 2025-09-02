'use client'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { useQueryState } from 'nuqs'
import { parseAsString } from 'nuqs'

interface SendEmailHeaderProps {
  onCreateClick: () => void
}

export function SendEmailHeader({ onCreateClick }: SendEmailHeaderProps) {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Send Email To Users</h2>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button onClick={onCreateClick} className="flex-shrink-0">
          Create Campaign
        </Button>
        <Input
          placeholder="Search email..."
          className="max-w-[300px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  )
}
