"use client"

import { BellIcon, MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import { useAppStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function Topbar() {
  const { notifications, currentUser } = useAppStore()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="glass sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          {/* <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search opportunities, students..."
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          /> */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/notifications" className="relative">
          <BellIcon className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Link>

        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{currentUser?.name || "Guest User"}</div>
            <div className="text-xs text-muted-foreground">{currentUser?.email || "guest@example.com"}</div>
          </div>
          <UserCircleIcon className="h-9 w-9 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
