"use client"

import { useEffect, useMemo, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/auth"
import {
  getMyStudentProfile,
  StudentProfile,
  updateMyStudentField,
  updateMyStudentProfile,
} from "@/lib/student-profile"
import { useUser } from "@/contexts/UserContext"

const READONLY_FIELDS = new Set(["registration_number", "user_id", "created_at", "updated_at"])
const BOOLEAN_FIELDS = new Set(["yd", "higher_education_plans"])
const ARRAY_FIELDS = new Set(["skills"])
const JSON_FIELDS = new Set(["current_address", "permanent_address", "amcat_details"])

function toLabel(field: string) {
  return field
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function isEmptyValue(value: unknown) {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "object") return Object.keys(value).length === 0
  return false
}

function displayValue(value: unknown) {
  if (value === null || value === undefined) return "Not provided"
  if (typeof value === "string") return value.trim() === "" ? "Not provided" : value
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided"
  if (typeof value === "object") {
    const objectValue = JSON.stringify(value)
    return objectValue === "{}" ? "Not provided" : objectValue
  }
  return String(value)
}

function toInputValue(field: string, value: unknown) {
  if (value === null || value === undefined) return ""
  if (ARRAY_FIELDS.has(field) && Array.isArray(value)) {
    return value.join(", ")
  }
  if (JSON_FIELDS.has(field) && typeof value === "object") {
    return JSON.stringify(value)
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false"
  }
  return String(value)
}

function parseInputValue(field: string, value: string) {
  if (value.trim() === "") {
    return null
  }

  if (BOOLEAN_FIELDS.has(field)) {
    return value === "true"
  }

  if (ARRAY_FIELDS.has(field)) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (JSON_FIELDS.has(field)) {
    return JSON.parse(value)
  }

  return value
}

type FormState = Record<string, string>

export default function StudentProfilePage() {
  const { user, loading: userLoading } = useUser()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [formState, setFormState] = useState<FormState>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isEditingAll, setIsEditingAll] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const editableFields = useMemo(() => {
    if (!profile) return []
    return Object.keys(profile).filter((field) => !READONLY_FIELDS.has(field))
  }, [profile])

  useEffect(() => {
    if (!profile) return

    const nextFormState: FormState = {}
    Object.entries(profile).forEach(([field, value]) => {
      if (!READONLY_FIELDS.has(field)) {
        nextFormState[field] = toInputValue(field, value)
      }
    })

    setFormState(nextFormState)
  }, [profile])

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError(null)
        setIsLoading(true)
        const student = await getMyStudentProfile()
        setProfile(student)
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Failed to load profile"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (!userLoading && user?.role === "student") {
      void loadProfile()
    } else if (!userLoading) {
      setIsLoading(false)
    }
  }, [userLoading, user?.role])

  const handleFieldSave = async (field: string) => {
    try {
      setError(null)
      setSuccess(null)
      const inputValue = formState[field] ?? ""

      let parsed: unknown
      try {
        parsed = parseInputValue(field, inputValue)
      } catch {
        setError(`Invalid input for ${toLabel(field)}. Please check format.`)
        return
      }

      const updated = await updateMyStudentField(field, parsed)
      setProfile(updated)
      setEditingField(null)
      setSuccess(`${toLabel(field)} updated successfully.`)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to update field"
      setError(message)
    }
  }

  const handleSaveAll = async () => {
    try {
      setIsSavingAll(true)
      setError(null)
      setSuccess(null)

      const payload: Record<string, unknown> = {}
      editableFields.forEach((field) => {
        const value = formState[field] ?? ""
        payload[field] = parseInputValue(field, value)
      })

      const updated = await updateMyStudentProfile(payload)
      setProfile(updated)
      setIsEditingAll(false)
      setEditingField(null)
      setSuccess("Profile updated successfully.")
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to update profile"
      setError(message)
    } finally {
      setIsSavingAll(false)
    }
  }

  if (isLoading || userLoading) {
    return <div className="text-sm text-muted-foreground">Loading profile...</div>
  }

  if (user?.role !== "student") {
    return (
      <Alert>
        <AlertTitle>Access restricted</AlertTitle>
        <AlertDescription>This profile view is currently available for student users only.</AlertDescription>
      </Alert>
    )
  }

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load profile</AlertTitle>
        <AlertDescription>{error ?? "Student profile was not found."}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground">View and update your student details.</p>
        </div>

        {!isEditingAll ? (
          <Button onClick={() => setIsEditingAll(true)}>Edit Entire Form</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditingAll(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAll} disabled={isSavingAll}>
              {isSavingAll ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        )}
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Update failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(profile).map(([field, value]) => {
          const isReadOnly = READONLY_FIELDS.has(field)
          const isInlineEditing = editingField === field
          const isEmpty = isEmptyValue(value)

          return (
            <Card key={field}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{toLabel(field)}</CardTitle>
                {isReadOnly ? <CardDescription>Read only</CardDescription> : null}
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditingAll && !isReadOnly ? (
                  <EditableInput
                    field={field}
                    value={formState[field] ?? ""}
                    onChange={(nextValue) => setFormState((prev) => ({ ...prev, [field]: nextValue }))}
                  />
                ) : isInlineEditing && !isReadOnly ? (
                  <>
                    <EditableInput
                      field={field}
                      value={formState[field] ?? ""}
                      onChange={(nextValue) => setFormState((prev) => ({ ...prev, [field]: nextValue }))}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleFieldSave(field)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="break-words text-sm text-foreground">{displayValue(value)}</p>
                    {!isReadOnly ? (
                      <Button size="sm" variant="outline" onClick={() => setEditingField(field)}>
                        {isEmpty ? "Add" : "Edit"}
                      </Button>
                    ) : null}
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function EditableInput({
  field,
  value,
  onChange,
}: {
  field: string
  value: string
  onChange: (value: string) => void
}) {
  if (field === "gender") {
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">Select gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    )
  }

  if (BOOLEAN_FIELDS.has(field)) {
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">Select value</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    )
  }

  if (ARRAY_FIELDS.has(field) || JSON_FIELDS.has(field)) {
    return (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    )
  }

  if (field === "date_of_birth") {
    return <Input type="date" value={value} onChange={(event) => onChange(event.target.value)} />
  }

  return <Input value={value} onChange={(event) => onChange(event.target.value)} />
}
