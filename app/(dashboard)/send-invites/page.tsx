"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ApiError, sendInviteMagicLinks } from "@/lib/auth"
import { useUser } from "@/contexts/UserContext"

type SendState = "idle" | "loading" | "success" | "error"

export default function SendInvitesPage() {
  const { user, loading: userLoading } = useUser()
  const [emailsInput, setEmailsInput] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [expiryTime, setExpiryTime] = useState("")
  const [state, setState] = useState<SendState>("idle")
  const [resultMessage, setResultMessage] = useState("")
  const [sentCount, setSentCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)

  // Check if user is TNP
  if (userLoading) {
    return (
      <div className="container mx-auto max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Magic Link Invites</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!user || user.role !== "tnp") {
    return (
      <div className="container mx-auto max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only TNP (Training and Placement) users can send invites.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Unauthorized</AlertTitle>
              <AlertDescription>
                You do not have permission to access this page. This feature is restricted to Training and Placement office users only.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Parse emails from textarea (comma or newline separated)
    const rawEmails = emailsInput
      .split(/[\n,]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0)

    if (rawEmails.length === 0) {
      setState("error")
      setResultMessage("Please enter at least one email address.")
      return
    }

    if (rawEmails.length > 200) {
      setState("error")
      setResultMessage("Maximum 200 emails allowed per batch.")
      return
    }

    if (!expiryDate || !expiryTime) {
      setState("error")
      setResultMessage("Please select an expiry date and time.")
      return
    }

    // Combine date and time into ISO string
    const expiryDateTime = new Date(`${expiryDate}T${expiryTime}`)
    if (isNaN(expiryDateTime.getTime())) {
      setState("error")
      setResultMessage("Invalid date or time format.")
      return
    }

    if (expiryDateTime <= new Date()) {
      setState("error")
      setResultMessage("Expiry date must be in the future.")
      return
    }

    setState("loading")
    setResultMessage("Sending invites...")

    try {
      const result = await sendInviteMagicLinks({
        emails: rawEmails,
        custom_message: customMessage.trim() || undefined,
        expires_at: expiryDateTime.toISOString(),
      })

      setSentCount(result.sent)
      setFailedCount(result.failed)
      setState("success")
      setResultMessage(result.message)
      
      // Clear form on success
      setEmailsInput("")
      setCustomMessage("")
    } catch (err) {
      setState("error")
      if (err instanceof ApiError) {
        setResultMessage(err.message)
      } else {
        setResultMessage("Failed to send invites. Please try again.")
      }
    }
  }

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Magic Link Invites</CardTitle>
          <CardDescription>
            Send invitation emails with auto-login magic links. Recipients will be signed in automatically.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emails">Email Addresses</Label>
              <Textarea
                id="emails"
                placeholder="Enter email addresses (comma or newline separated)&#10;example1@email.com, example2@email.com&#10;example3@email.com"
                value={emailsInput}
                onChange={(e) => setEmailsInput(e.target.value)}
                rows={6}
                disabled={state === "loading"}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Maximum 200 emails per batch. Duplicates will be removed automatically.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to include in the invitation email..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                disabled={state === "loading"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  disabled={state === "loading"}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry-time">Expiry Time</Label>
                <Input
                  id="expiry-time"
                  type="time"
                  value={expiryTime}
                  onChange={(e) => setExpiryTime(e.target.value)}
                  disabled={state === "loading"}
                  required
                />
              </div>
            </div>

            {(state === "success" || state === "error") && (
              <Alert variant={state === "error" ? "destructive" : "default"}>
                <AlertTitle>
                  {state === "success" ? "Invites Sent" : "Error"}
                </AlertTitle>
                <AlertDescription>
                  {resultMessage}
                  {state === "success" && (
                    <div className="mt-2 text-sm">
                      <p>✓ Sent: {sentCount}</p>
                      {failedCount > 0 && <p>✗ Failed: {failedCount}</p>}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={state === "loading"} className="w-full">
              {state === "loading" ? "Sending..." : "Send Invites"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
