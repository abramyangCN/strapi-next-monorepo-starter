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

    const strapiFormData = new FormData()
    strapiFormData.append("data", JSON.stringify(data))

    for (const file of files) {
      strapiFormData.append("files.files", file, file.name)
    }

    const strapiUrl = getEnvVar("STRAPI_URL", true)
    const url = `${strapiUrl}/api/quotations`

    const authHeader = await createStrapiAuthHeader({
      isReadOnly: false,
      isPrivate: false,
    })

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...authHeader,
      },
      body: strapiFormData,
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
