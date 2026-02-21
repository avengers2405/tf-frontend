"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, Suspense } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiError, verifyInviteMagicLink } from "@/lib/auth"

type VerifyState = "idle" | "loading" | "success" | "error"

function InviteVerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasStarted = useRef(false)
  const [state, setState] = useState<VerifyState>("idle")
  const [message, setMessage] = useState("Preparing verification...")
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (hasStarted.current) {
      return
    }

    hasStarted.current = true

    const token = searchParams.get("token")

    if (!token) {
      setState("error")
      setMessage("Invitation link is invalid. Missing token.")
      return
    }

    const run = async () => {
      setState("loading")
      setMessage("Verifying your invitation and signing you in...")

      try {
        const response = await verifyInviteMagicLink(token)

        setState("success")
        setMessage("Invitation verified successfully. You are now signed in!")
        setUserRole(response.user.role || null)
      } catch (err) {
        if (err instanceof ApiError) {
          setMessage(err.message)
        } else {
          setMessage("Verification failed. The invitation link may have expired or is invalid.")
        }

        setState("error")
      }
    }

    void run()
  }, [searchParams])

  const handleContinue = () => {
    // Redirect based on role
    const roleRoutes: Record<string, string> = {
      recruiter: "/dashboard/recruiter",
      tnp: "/dashboard/tnp",
      teacher: "/dashboard/teacher",
      student: "/dashboard/student",
    }

    const route = userRole && roleRoutes[userRole] ? roleRoutes[userRole] : "/dashboard"
    router.push(route)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invitation Verification</CardTitle>
          <CardDescription>We are confirming your invitation link.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {state === "loading" || state === "idle" ? (
            <Alert>
              <AlertTitle>Processing</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          {state === "success" ? (
            <Alert>
              <AlertTitle>Verification Complete</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          {state === "error" ? (
            <Alert variant="destructive">
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          {state === "success" ? (
            <Button className="w-full" onClick={handleContinue}>
              Continue to Dashboard
            </Button>
          ) : null}

          {state === "error" ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                This invitation link may have expired or already been used. Please contact the sender for a new invitation, or{" "}
                <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                  login here
                </Link>
                {" "}if you already have an account.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

export default function InviteVerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invitation Verification</CardTitle>
            <CardDescription>Loading verification...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <InviteVerifyContent />
    </Suspense>
  )
}
