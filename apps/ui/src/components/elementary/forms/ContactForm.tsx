"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"

import AppLink from "@/components/elementary/AppLink"
import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { AppSelect } from "@/components/forms/AppSelect"
import { AppTextArea } from "@/components/forms/AppTextArea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useContactForm } from "@/hooks/useAppForm"

export function ContactForm({
  gdpr,
}: Readonly<{
  gdpr?: { href?: string; label?: string; newTab?: boolean }
}>) {
  const t = useTranslations("contactForm")
  const { toast } = useToast()
  const contactFormMutation = useContactForm()

  const inquiryTypeOptions = [
    { value: "general-inquiry", label: t("inquiryTypeGeneral") },
    { value: "technical-support", label: t("inquiryTypeTechnical") },
    { value: "quotation-request", label: t("inquiryTypeQuotation") },
    { value: "partnership", label: t("inquiryTypePartnership") },
    { value: "other", label: t("inquiryTypeOther") },
  ]

  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      inquiryType: undefined,
      message: "",
    },
  })

  const onSubmit = (values: z.infer<FormSchemaType>) => {
    contactFormMutation.mutate(values, {
      onSuccess: () => {
        toast({ variant: "default", description: t("success") })
        form.reset()
      },
      onError: () => {
        toast({ variant: "destructive", description: t("error") })
      },
    })
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id={contactFormName}
        className="w-full"
      >
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:gap-6">
          <AppField
            containerClassName="col-span-1"
            name="firstName"
            type="text"
            required
            placeholder={t("firstNamePlaceholder")}
          />
          <AppField
            containerClassName="col-span-1"
            name="lastName"
            type="text"
            required
            placeholder={t("lastNamePlaceholder")}
          />
          <AppField
            containerClassName="col-span-1 md:col-span-2"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t("emailPlaceholder")}
          />
          <AppField
            containerClassName="col-span-1 md:col-span-2"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder={t("phonePlaceholder")}
          />
          <AppField
            containerClassName="col-span-1"
            name="company"
            type="text"
            required
            placeholder={t("companyPlaceholder")}
          />
          <AppField
            containerClassName="col-span-1"
            name="jobTitle"
            type="text"
            placeholder={t("jobTitlePlaceholder")}
          />
          <AppSelect
            containerClassName="col-span-1 md:col-span-2"
            name="inquiryType"
            required
            placeholder={t("inquiryTypePlaceholder")}
            options={inquiryTypeOptions}
          />
          <AppTextArea
            containerClassName="col-span-1 md:col-span-2 text-sm"
            name="message"
            required
            placeholder={t("messagePlaceholder")}
          />
        </div>
      </AppForm>

      <div className="flex w-full flex-col gap-4">
        {gdpr?.href && (
          <div className="flex flex-col items-start text-sm text-gray-600 sm:flex-row sm:items-center">
            <span>{t("gdpr")} </span>
            <AppLink
              openInNewTab={gdpr.newTab}
              className="text-primary-700 ml-1 font-medium hover:underline"
              href={gdpr.href}
            >
              {gdpr.label || t("gdprLink")}
            </AppLink>
          </div>
        )}

        <Button
          type="submit"
          className="bg-primary-700 hover:bg-primary-800 h-14 w-full cursor-pointer rounded-none text-base font-bold tracking-wide text-white uppercase"
          form={contactFormName}
          disabled={contactFormMutation.isPending}
        >
          {contactFormMutation.isPending ? "..." : t("submit")}
        </Button>
      </div>
    </div>
  )
}

const ContactFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().min(1),
  phone: z.string().min(1),
  company: z.string().min(1),
  jobTitle: z.string().optional(),
  inquiryType: z.enum([
    "general-inquiry",
    "technical-support",
    "quotation-request",
    "partnership",
    "other",
  ]),
  message: z.string().min(10),
})

type FormSchemaType = typeof ContactFormSchema

export const contactFormName = "contactForm"
