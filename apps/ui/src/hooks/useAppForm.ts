"use client"

import { useMutation } from "@tanstack/react-query"

import { PublicStrapiClient } from "@/lib/strapi-api"

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
      const path = PublicStrapiClient.getStrapiApiPathByUId(
        "api::subscriber.subscriber"
      )

      const response = await PublicStrapiClient.fetchAPI(
        path,
        undefined,
        {
          method: "POST",
          body: JSON.stringify({ data: values }),
        },
        { useProxy: true }
      )

      return response
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
