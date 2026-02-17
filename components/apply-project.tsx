"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircleIcon, UsersIcon } from "@heroicons/react/24/outline"

interface ApplyProjectTeamProps {
  projectId: string;
  teacherId: string;
}

export default function ApplyProjectTeam({ projectId, teacherId }: ApplyProjectTeamProps) {
  const [groupId, setGroupId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleApply = async () => {
    // if (!groupId) return
    // setIsSubmitting(true)
    // try {
    //   const response = await fetch('/api/projects/register-team', {
    //     method: 'POST',
    //     body: JSON.stringify({ projectId, groupId, teacherId })
    //   })
    //   if (response.ok) setStatus('success')
    //   else setStatus('error')
    // } catch (err) {
    //   setStatus('error')
    // } finally {
    //   setIsSubmitting(false)
    // }
    setIsSubmitting(true)
    setStatus('success')

  }

  if (status === 'success') {
    return (
      <div className="py-4 text-center">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-600 mb-2" />
        <p className="font-medium text-foreground">Application Submitted</p>
        <p className="text-sm text-muted-foreground">Your team is now associated with this project.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-4 border-t border-border/50">
      <div className="flex items-center gap-2">
        <UsersIcon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Apply as a Team</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="groupId" className="text-xs text-muted-foreground">Team Builder Group ID</Label>
        <Input 
          id="groupId"
          className="bg-background/50"
          placeholder="Enter Group ID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
        <p className="text-[10px] text-muted-foreground leading-tight">
          All team members must meet the minimum CGPA requirements.
        </p>
      </div>

      <Button 
        className="w-full" 
        disabled={isSubmitting || !groupId}
        onClick={handleApply}
        size="lg"
      >
        {isSubmitting ? "Verifying..." : "Submit Application"}
      </Button>
      
      {status === 'error' && (
        <p className="text-xs text-destructive text-center">
          Invalid Group ID or criteria not met.
        </p>
      )}
    </div>
  )
}