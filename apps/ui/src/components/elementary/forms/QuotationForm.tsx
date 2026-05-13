"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"

import AppLink from "@/components/elementary/AppLink"
import { AppField } from "@/components/forms/AppField"
import { AppFileUpload } from "@/components/forms/AppFileUpload"
import { AppForm } from "@/components/forms/AppForm"
import { AppTextArea } from "@/components/forms/AppTextArea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useQuotationForm } from "@/hooks/useAppForm"

type FormType = "low-volume" | "prototyping"

interface QuotationFormProps {
  formType: FormType
  gdpr?: { href?: string; label?: string; newTab?: boolean }
  buttonText?: string
  sampleDocumentLink?: { href?: string; label?: string; newTab?: boolean }
}

export function QuotationForm({
  formType,
  gdpr,
  buttonText,
  sampleDocumentLink,
}: QuotationFormProps) {
  const t = useTranslations("quotationForm")
  const { toast } = useToast()
  const quotationMutation = useQuotationForm()

  const formSchema = getFormSchema(formType)

  const form = useForm({
    // @ts-expect-error - zodResolver type issue with conditional schemas
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      formType,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      address: "",
      quantityOfParts: "",
      materials: "",
      technology: "",
      ...(formType === "low-volume"
        ? { complianceCertificates: "" }
        : { finish: "" }),
      surfaceCondition: "",
      message: "",
      files: null,
    } as Record<string, unknown>,
  })

  const onSubmit = async (values: Record<string, unknown>) => {
    const formData = new FormData()

    // Add form fields
    Object.entries(values).forEach(([key, value]) => {
      if (key === "files" && value instanceof FileList) {
        // Add files separately
        Array.from(value).forEach((file) => {
          formData.append("files", file)
        })
      } else if (key !== "files") {
        formData.append(key, value as string)
      }
    })

    quotationMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          variant: "default",
          description: t("success"),
        })
        form.reset()
      },
      onError: () => {
        toast({
          variant: "destructive",
          description: t("error"),
        })
      },
    })
  }

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-6">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id={quotationFormName}
        className="w-full"
      >
        <div className="grid w-full grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6">
          {/* Production Requirements */}
          <div className="order-1 col-span-1 grid grid-cols-1 gap-4 sm:gap-6 lg:order-0 lg:col-span-6 lg:grid-cols-2">
            <AppField
              containerClassName="col-span-1 lg:col-span-2"
              name="quantityOfParts"
              type="text"
              required
              placeholder={t("quantityOfPartsPlaceholder")}
            />

            <AppField
              containerClassName="col-span-1 lg:col-span-2"
              name="materials"
              type="text"
              required
              placeholder={t("materialsPlaceholder")}
            />

            <AppField
              containerClassName="col-span-1 lg:col-span-2"
              name="technology"
              type="text"
              required
              placeholder={t("technologyPlaceholder")}
            />

            {formType === "low-volume" ? (
              <AppField
                containerClassName="col-span-1 lg:col-span-2"
                name="complianceCertificates"
                type="text"
                required
                placeholder={t("complianceCertificatesPlaceholder")}
              />
            ) : (
              <AppField
                containerClassName="col-span-1 lg:col-span-2"
                name="finish"
                type="text"
                required
                placeholder={t("finishPlaceholder")}
              />
            )}

            <AppField
              containerClassName="col-span-1 lg:col-span-2"
              name="surfaceCondition"
              type="text"
              required
              placeholder={t("surfaceConditionPlaceholder")}
            />
          </div>

          {/* Basic Information */}
          <div className="order-2 col-span-1 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:order-0 lg:col-span-6">
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
              containerClassName="col-span-1 sm:col-span-2"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={t("emailPlaceholder")}
            />

            <AppField
              containerClassName="col-span-1 sm:col-span-2"
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

            <AppField
              containerClassName="col-span-1 sm:col-span-2"
              name="address"
              placeholder={t("addressPlaceholder")}
              required
            />
          </div>

          <AppTextArea
            containerClassName="order-3 col-span-1 lg:order-0 lg:col-span-12"
            name="message"
            placeholder={t("messagePlaceholder")}
          />

          <AppFileUpload
            containerClassName="order-4 col-span-1 lg:order-0 lg:col-span-12"
            name="files"
            label={t("filesLabel")}
            accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.stl,.obj"
            multiple
            maxSize={10}
            description={t("filesDescription")}
          />
        </div>

        {sampleDocumentLink?.href && (
          <div className="mt-2 sm:mt-4">
            <div className="text-sm text-gray-600">
              <AppLink
                href={sampleDocumentLink.href}
                openExternalInNewTab={sampleDocumentLink.newTab}
                className="text-primary-700 inline-flex min-h-[44px] items-center hover:underline active:opacity-80"
              >
                {sampleDocumentLink.label || t("sampleDocumentLink")}
              </AppLink>
            </div>
          </div>
        )}
      </AppForm>

      <div className="flex w-full flex-col gap-3 sm:gap-4">
        {gdpr?.href && (
          <div className="flex flex-col items-start gap-1 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-0">
            <span>{t("gdpr")} </span>
            <AppLink
              openExternalInNewTab={gdpr.newTab}
              className="text-primary-700 font-medium hover:underline active:opacity-80 sm:ml-1"
              href={gdpr.href}
            >
              {gdpr.label || t("gdprLink")}
            </AppLink>
          </div>
        )}

        <Button
          type="submit"
          className="bg-primary-700 hover:bg-primary-800 active:bg-primary-900 h-12 w-full cursor-pointer rounded-none text-sm font-bold tracking-wide text-white uppercase transition-colors sm:h-14 sm:text-base"
          form={quotationFormName}
          disabled={quotationMutation.isPending}
        >
          {quotationMutation.isPending
            ? t("submitting")
            : (buttonText ?? t("submit"))}
        </Button>
      </div>

      {quotationMutation.error && (
        <div className="mt-4 text-center text-red-500">
          <p>{t("error")}</p>
        </div>
      )}
    </div>
  )
}

const lowVolumeSchema = z.object({
  formType: z.literal("low-volume" as const),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().min(1),
  jobTitle: z.string().optional(),
  address: z.string().min(1),
  quantityOfParts: z.string().min(1),
  materials: z.string().min(1),
  technology: z.string().min(1),
  complianceCertificates: z.string().min(1),
  surfaceCondition: z.string().min(1),
  message: z.string().optional(),
  files: z.any().optional(),
})

const prototypingSchema = z.object({
  formType: z.literal("prototyping" as const),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().min(1),
  jobTitle: z.string().optional(),
  address: z.string().min(1),
  quantityOfParts: z.string().min(1),
  materials: z.string().min(1),
  technology: z.string().min(1),
  finish: z.string().min(1),
  surfaceCondition: z.string().min(1),
  message: z.string().optional(),
  files: z.any().optional(),
})

function getFormSchema(formType: FormType) {
  return formType === "low-volume" ? lowVolumeSchema : prototypingSchema
}

export const quotationFormName = "quotationForm"
