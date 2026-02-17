"use client"

export interface AuthUser {
  id: string
  username: string
  email: string
  is_verified: boolean
}

export interface TokenPair {
  access_token: string
  refresh_token: string
}

interface RegisterResponse {
  message: string
  preview_link?: string
  user: AuthUser
}

interface LoginResponse extends TokenPair {
  message?: string
  user: AuthUser
}

interface VerifyResponse extends TokenPair {
  message: string
  user: AuthUser
}

interface RefreshResponse extends TokenPair {
  message: string
}

interface RequestMagicLinkResponse {
  message: string
  preview_link?: string
}

interface MeResponse {
  user: AuthUser
}

const ACCESS_TOKEN_KEY = "auth_access_token"
const REFRESH_TOKEN_KEY = "auth_refresh_token"

let inMemoryAccessToken: string | null = null

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"
}

function isBrowser() {
  return typeof window !== "undefined"
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

async function parseApiError(response: Response): Promise<ApiError> {
  const payload = await safeJson<{
    message?: string
    error?: string
    errors?: Array<{ message?: string } | string>
  }>(response)

  const list = payload?.errors
  const firstListError = Array.isArray(list)
    ? typeof list[0] === "string"
      ? list[0]
      : list[0]?.message
    : undefined

  const message = payload?.message ?? payload?.error ?? firstListError ?? "Request failed"
  return new ApiError(message, response.status)
}

function saveTokens(tokens: TokenPair) {
  inMemoryAccessToken = tokens.access_token

  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
}

export function setAuthTokens(tokens: TokenPair) {
  saveTokens(tokens)
}

export function clearAuthTokens() {
  inMemoryAccessToken = null

  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getAccessToken() {
  if (inMemoryAccessToken) {
    return inMemoryAccessToken
  }

  if (!isBrowser()) {
    return null
  }

  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY)
  inMemoryAccessToken = token
  return token
}

export function getRefreshToken() {
  if (!isBrowser()) {
    return null
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl()}${path}`, init)

  if (!response.ok) {
    throw await parseApiError(response)
  }

  const payload = await safeJson<T>(response)
  if (!payload) {
    throw new ApiError("Invalid server response", response.status)
  }

  return payload
}

export async function registerUser(input: {
  username: string
  email: string
  password: string
}) {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function requestMagicLink(identifier: string) {
  return request<RequestMagicLinkResponse>("/auth/magic-link/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier }),
  })
}

export async function verifyMagicLink(token: string) {
  return request<VerifyResponse>("/auth/magic-link/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })
}

export async function loginUser(input: { identifier: string; password: string }) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function refreshToken(refreshTokenValue: string) {
  const refreshed = await request<RefreshResponse>("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshTokenValue }),
  })

  saveTokens(refreshed)
  return refreshed
}

export async function logoutUser(refreshTokenValue: string | null) {
  if (!refreshTokenValue) {
    clearAuthTokens()
    return
  }

  try {
    await request<{ message: string }>("/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshTokenValue }),
    })
  } finally {
    clearAuthTokens()
  }
}

export async function authFetch(path: string, init: RequestInit = {}) {
  const makeRequest = async (accessToken: string | null) => {
    const headers = new Headers(init.headers)
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`)
    }

    return fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      headers,
    })
  }

  const response = await makeRequest(getAccessToken())

  if (response.status !== 401 || path === "/auth/refresh") {
    return response
  }

  const refreshTokenValue = getRefreshToken()
  if (!refreshTokenValue) {
    clearAuthTokens()
    return response
  }

  try {
    const refreshed = await refreshToken(refreshTokenValue)
    return await makeRequest(refreshed.access_token)
  } catch {
    clearAuthTokens()
    return response
  }
}

export async function getCurrentUser() {
  const response = await authFetch("/auth/me", {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response)
  }

  const payload = await safeJson<MeResponse>(response)
  if (!payload) {
    throw new ApiError("Invalid server response", response.status)
  }

  return payload
}
