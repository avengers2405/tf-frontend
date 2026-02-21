import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  // Update the type to indicate params is a Promise
  { params }: { params: Promise<{ filename: string }> } 
) {
  try {
    // 1. AWAIT the params object to extract the filename (Next.js 15 requirement)
    const resolvedParams = await params
    const filename = resolvedParams.filename

    // 2. Build the secure path
    const filePath = path.join(process.cwd(), 'uploads', 'anonymized', filename)

    // 3. Read the file
    const fileBuffer = await readFile(filePath)

    // 4. Send the file back to the browser
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`, 
      },
    })
  } catch (error) {
    console.error('Error serving PDF:', error)
    return new NextResponse('PDF not found or unavailable', { status: 404 })
  }
}