"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface Log {
  id: string
  created_at: string
  identifier: string | null
  type: string
  source: string | null
  data: any
}

interface LogsResponse {
  success: boolean
  count: number
  start: string
  offset: number
  logs: Log[]
  message?: string
  error?: string
}

export default function LogsPage() {
  const [initialDateTime, setInitialDateTime] = useState<Date>(new Date())
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchLogs = async (page: number = 0) => {
    try {
      setLoading(true)
      const offset = page * 100
      const startParam = initialDateTime.toISOString()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/logs?start=${startParam}&offset=${offset}`,
        { credentials: "include" }
      )

      const data: LogsResponse = await response.json()

      if (data.success) {
        setLogs(data.logs)
        setHasMore(data.count === 100) // If we got 100 logs, there might be more
      } else {
        console.error("Failed to fetch logs:", data.message)
        setLogs([])
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
      setLogs([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(currentPage)
  }, [currentPage])

  const handleRefresh = () => {
    setInitialDateTime(new Date())
    setCurrentPage(0)
    fetchLogs(0)
  }

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const formatData = (data: any) => {
    if (typeof data === "string") return data
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type.toUpperCase()) {
      case "ERROR":
        return "destructive"
      case "WARN":
        return "outline"
      case "DEBUG":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Viewing logs from {initialDateTime.toLocaleString()}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>
            Page {currentPage + 1} • Showing {logs.length} log{logs.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading logs...</div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">No logs found</div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[150px]">Identifier</TableHead>
                    <TableHead className="w-[150px]">Source</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(log.type)}>
                          {log.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.identifier ? (
                          <Badge variant="outline">{log.identifier}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.source ? (
                          <span className="text-sm">{log.source}</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <details className="cursor-pointer group">
                          <summary className="list-none">
                            <div className="flex items-center gap-2">
                              <span className="text-sm truncate max-w-[400px] block">
                                {formatData(log.data)}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="shrink-0 h-6 px-2 group-open:rotate-180 transition-transform"
                              >
                                <ChevronRightIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </summary>
                          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto max-w-full whitespace-pre-wrap break-words">
                            {formatData(log.data)}
                          </pre>
                        </details>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Viewing logs {currentPage * 100 + 1}-{currentPage * 100 + logs.length}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="text-sm font-medium">Page {currentPage + 1}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!hasMore}
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}