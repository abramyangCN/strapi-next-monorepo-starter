"use client"

import { useMutation } from "@tanstack/react-query"

export function useContactForm() {
  return useMutation({
    mutationFn: async (values: {
      firstName: string
      lastName: string
      email: string
      phone: string
      company: string
      jobTitle?: string
      inquiryType: string
      message: string
    }) => {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: values }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))

        throw new Error(error?.error ?? "Failed to submit contact form")
      }

      return response.json()
    },
  })
}

export function useQuotationForm() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/quotations", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit quotation form")
      }

      return response.json()
    },
  })
}
