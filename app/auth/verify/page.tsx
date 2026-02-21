"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, Suspense } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiError, verifyMagicLink } from "@/lib/auth"

type VerifyState = "idle" | "loading" | "success" | "error"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasStarted = useRef(false)
  const [state, setState] = useState<VerifyState>("idle")
  const [message, setMessage] = useState("Preparing verification...")

  useEffect(() => {
    if (hasStarted.current) {
      return
    }

    hasStarted.current = true

    const token = searchParams.get("token")

    if (!token) {
      setState("error")
      setMessage("Verification link is invalid. Missing token.")
      return
    }

    const run = async () => {
      setState("loading")
      setMessage("Verifying your email...")

      try {
        await verifyMagicLink(token)

        setState("success")
        setMessage("Email verified successfully. Your account is ready.")
      } catch (err) {
        if (err instanceof ApiError) {
          setMessage(err.message)
        } else {
          setMessage("Verification failed. Please request a new verification link.")
        }

        setState("error")
      }
    }

    void run()
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email verification</CardTitle>
          <CardDescription>We are confirming your verification link.</CardDescription>
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
              <AlertTitle>Verification complete</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          {state === "error" ? (
            <Alert variant="destructive">
              <AlertTitle>Verification failed</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          {state === "success" ? (
            <Button className="w-full" onClick={() => router.push("/dashboard/student")}>
              Continue to dashboard
            </Button>
          ) : null}

          {state === "error" ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Request another link from{" "}
                <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                  login
                </Link>
                .
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email verification</CardTitle>
            <CardDescription>Loading verification...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
