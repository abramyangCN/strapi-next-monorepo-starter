"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { RippleButton } from "@/components/ui/ripple-button"
import { useToast } from "@/components/ui/use-toast"

interface NewsletterFormProps {
  newsletter?: {
    title?: string
    button?: string
    gdpr?: string
    placeholder?: string
  }
}

export function NewsletterForm({ newsletter }: NewsletterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslations("newsletterForm")
  const { toast } = useToast()

  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(NewsletterFormSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: { email: "" },
  })

  async function onSubmit(values: z.infer<FormSchemaType>) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { email: values.email } }),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe")
      }

      toast({
        title: t("successTitle"),
        description: t("success"),
        className: "border-secondary-500 bg-secondary-50 text-secondary-900",
      })

      form.reset()
    } catch {
      toast({
        title: t("errorTitle"),
        description: t("error"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex w-full flex-col">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id={newsletterForm}
        className="w-full"
        fieldsetClassName="flex flex-col gap-3 md:flex-row md:gap-0"
      >
        <AppField
          name="email"
          type="text"
          autoComplete="email"
          required
          containerClassName="flex-1"
          fieldClassName="h-12 w-full flex-1 border border-white bg-white px-4 text-black placeholder:text-black/60 md:min-w-80"
          aria-label="email"
          placeholder={newsletter?.placeholder ?? "Enter your email"}
        />
        <RippleButton
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full shrink-0 px-8 text-sm font-medium md:w-auto"
        >
          {isSubmitting ? "..." : (newsletter?.button ?? "SUBSCRIBE")}
        </RippleButton>
      </AppForm>
    </div>
  )
}

const NewsletterFormSchema = z.object({
  email: z.string().email(),
})

type FormSchemaType = typeof NewsletterFormSchema

export const newsletterForm = "newsletterForm"
