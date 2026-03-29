import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import type React from "react"

import { setupLibraries } from "@/lib/general-helpers"

// Setup libraries in server environment
setupLibraries()

interface Props {
  readonly children: React.ReactNode
}

export async function ServerProviders({ children }: Props) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
