import { NextResponse } from "next/server"

import { getEnvVar } from "@/lib/env-vars"
import { createStrapiAuthHeader } from "@/lib/strapi-api/request-auth"

export async function POST(request: Request) {
  try {
    const body = await request.text()

    const strapiUrl = getEnvVar("STRAPI_URL", true)
    const url = `${strapiUrl}/api/contacts`

    const authHeader = await createStrapiAuthHeader({
      isReadOnly: false,
      isPrivate: false,
    })

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))

      return NextResponse.json(
        { error: error?.error?.message ?? "Failed to submit contact form" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
