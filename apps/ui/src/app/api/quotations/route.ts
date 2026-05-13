import { NextResponse } from "next/server"

import { getEnvVar } from "@/lib/env-vars"
import { createStrapiAuthHeader } from "@/lib/strapi-api/request-auth"

export async function POST(request: Request) {
  try {
    const incomingFormData = await request.formData()

    const data: Record<string, string> = {}
    const files: File[] = []

    for (const [key, value] of incomingFormData.entries()) {
      if (key === "files" && value instanceof File && value.size > 0) {
        files.push(value)
        continue
      }

      if (typeof value === "string") {
        data[key] = value
      }
    }

    const strapiUrl = getEnvVar("STRAPI_URL", true)
    const authHeader = await createStrapiAuthHeader({
      isReadOnly: false,
      isPrivate: false,
    })

    if (files.length > 0) {
      const uploadFormData = new FormData()

      for (const file of files) {
        uploadFormData.append("files", file, file.name)
      }

      const uploadResponse = await fetch(`${strapiUrl}/api/upload`, {
        method: "POST",
        headers: {
          ...authHeader,
        },
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json().catch(() => ({}))

        return NextResponse.json(
          {
            error: error?.error?.message ?? "Failed to upload quotation files",
          },
          { status: uploadResponse.status }
        )
      }

      const uploadedFiles = (await uploadResponse.json()) as { id: number }[]
      data.files = JSON.stringify(uploadedFiles.map((file) => file.id))
    }

    const response = await fetch(`${strapiUrl}/api/quotations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify({
        data: {
          ...data,
          ...(data.files ? { files: JSON.parse(data.files) as number[] } : {}),
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))

      return NextResponse.json(
        { error: error?.error?.message ?? "Failed to submit quotation form" },
        { status: response.status }
      )
    }

    const result = await response.json()

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
