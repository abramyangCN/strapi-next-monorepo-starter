"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
  buttonText = "FINALIZE MY REQUEST",
  sampleDocumentLink,
}: QuotationFormProps) {
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
          description: "Request submitted successfully!",
        })
        form.reset()
      },
      onError: () => {
        toast({
          variant: "destructive",
          description: "Failed to submit request",
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
              placeholder="Quantity of Parts*"
            />

            <AppField
              containerClassName="col-span-1 lg:col-span-2"
              name="materials"
              type="text"
              required
              placeholder="Materials*"
            />

            <AppField
              containerClassName="col-span-1 lg:col-span-2"
              name="technology"
              type="text"
              required
              placeholder="Technology*"
            />

            {formType === "low-volume" ? (
              <AppField
                containerClassName="col-span-1 lg:col-span-2"
                name="complianceCertificates"
                type="text"
                required
                placeholder="Compliance Certificates*"
              />
            ) : (
              <AppField
                containerClassName="col-span-1 lg:col-span-2"
                name="finish"
                type="text"
                required
                placeholder="Finish*"
              />
            )}

            <AppField
              containerClassName="col-span-1 lg:col-span-2"
              name="surfaceCondition"
              type="text"
              required
              placeholder="Surface Condition*"
            />
          </div>

          {/* Basic Information */}
          <div className="order-2 col-span-1 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:order-0 lg:col-span-6">
            <AppField
              containerClassName="col-span-1"
              name="firstName"
              type="text"
              required
              placeholder="First Name*"
            />
            <AppField
              containerClassName="col-span-1"
              name="lastName"
              type="text"
              required
              placeholder="Last Name*"
            />

            <AppField
              containerClassName="col-span-1 sm:col-span-2"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="E-mail*"
            />

            <AppField
              containerClassName="col-span-1 sm:col-span-2"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="Phone*"
            />

            <AppField
              containerClassName="col-span-1"
              name="company"
              type="text"
              required
              placeholder="Company*"
            />
            <AppField
              containerClassName="col-span-1"
              name="jobTitle"
              type="text"
              placeholder="Job title"
            />

            <AppField
              containerClassName="col-span-1 sm:col-span-2"
              name="address"
              placeholder="Address*"
              required
            />
          </div>

          <AppTextArea
            containerClassName="order-3 col-span-1 lg:order-0 lg:col-span-12"
            name="message"
            placeholder="Write Message"
          />

          <AppFileUpload
            containerClassName="order-4 col-span-1 lg:order-0 lg:col-span-12"
            name="files"
            label="Upload Technical Drawings or CAD Files"
            accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.stl,.obj"
            multiple
            maxSize={10}
            description="Accepted formats: PDF, DWG, DXF, STEP, IGES, STL, OBJ (Max 10MB per file)"
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
                {sampleDocumentLink.label || "View sample document"}
              </AppLink>
            </div>
          </div>
        )}
      </AppForm>

      <div className="flex w-full flex-col gap-3 sm:gap-4">
        {gdpr?.href && (
          <div className="flex flex-col items-start gap-1 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-0">
            <span>By submitting, you agree to our </span>
            <AppLink
              openExternalInNewTab={gdpr.newTab}
              className="text-primary-700 font-medium hover:underline active:opacity-80 sm:ml-1"
              href={gdpr.href}
            >
              {gdpr.label || "Privacy Policy"}
            </AppLink>
          </div>
        )}

        <Button
          type="submit"
          className="bg-primary-700 hover:bg-primary-800 active:bg-primary-900 h-12 w-full cursor-pointer rounded-none text-sm font-bold tracking-wide text-white uppercase transition-colors sm:h-14 sm:text-base"
          form={quotationFormName}
          disabled={quotationMutation.isPending}
        >
          {quotationMutation.isPending ? "Submitting..." : buttonText}
        </Button>
      </div>

      {quotationMutation.error && (
        <div className="mt-4 text-center text-red-500">
          <p>{quotationMutation.error.message || "Failed to submit request"}</p>
        </div>
      )}
    </div>
  )
}

const lowVolumeSchema = z.object({
  formType: z.literal("low-volume" as const),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().min(1, "Company is required"),
  jobTitle: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  quantityOfParts: z.string().min(1, "Quantity is required"),
  materials: z.string().min(1, "Materials are required"),
  technology: z.string().min(1, "Technology is required"),
  complianceCertificates: z
    .string()
    .min(1, "Compliance certificates are required"),
  surfaceCondition: z.string().min(1, "Surface condition is required"),
  message: z.string().optional(),
  files: z.any().optional(),
})

const prototypingSchema = z.object({
  formType: z.literal("prototyping" as const),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().min(1, "Company is required"),
  jobTitle: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  quantityOfParts: z.string().min(1, "Quantity is required"),
  materials: z.string().min(1, "Materials are required"),
  technology: z.string().min(1, "Technology is required"),
  finish: z.string().min(1, "Finish is required"),
  surfaceCondition: z.string().min(1, "Surface condition is required"),
  message: z.string().optional(),
  files: z.any().optional(),
})

function getFormSchema(formType: FormType) {
  return formType === "low-volume" ? lowVolumeSchema : prototypingSchema
}

export const quotationFormName = "quotationForm"
