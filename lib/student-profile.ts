"use client"

import { ApiError, authFetch } from "@/lib/auth"

export type StudentProfile = Record<string, unknown>

interface StudentProfileResponse {
  success: boolean
  student: StudentProfile
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

async function readApiError(response: Response): Promise<ApiError> {
  const payload = await safeJson<{ message?: string; error?: string }>(response)
  const message = payload?.message ?? payload?.error ?? "Request failed"
  return new ApiError(message, response.status)
}

export async function getMyStudentProfile(): Promise<StudentProfile> {
  const response = await authFetch("/api/students/me", {
    method: "GET",
  })

  if (!response.ok) {
    throw await readApiError(response)
  }

  const payload = await safeJson<StudentProfileResponse>(response)
  if (!payload?.student) {
    throw new ApiError("Invalid server response", response.status)
  }

  return payload.student
}

export async function updateMyStudentField(field: string, value: unknown): Promise<StudentProfile> {
  const response = await authFetch("/api/students/me/field", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, value }),
  })

  if (!response.ok) {
    throw await readApiError(response)
  }

  const payload = await safeJson<StudentProfileResponse>(response)
  if (!payload?.student) {
    throw new ApiError("Invalid server response", response.status)
  }

  return payload.student
}

export async function updateMyStudentProfile(data: Record<string, unknown>): Promise<StudentProfile> {
  const response = await authFetch("/api/students/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw await readApiError(response)
  }

  const payload = await safeJson<StudentProfileResponse>(response)
  if (!payload?.student) {
    throw new ApiError("Invalid server response", response.status)
  }

  return payload.student
}
