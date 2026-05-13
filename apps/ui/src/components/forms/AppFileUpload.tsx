"use client"

import { Upload, X } from "lucide-react"
import { useTranslations } from "next-intl"
import type React from "react"
import { useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

import { AppFormDescription } from "@/components/forms/AppFormDescription"
import { AppFormLabel } from "@/components/forms/AppFormLabel"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/styles"

type Props = {
  readonly name: string
  readonly label?: React.ReactNode
  readonly containerClassName?: string
  readonly fieldClassName?: string
  readonly description?: React.ReactNode
  readonly accept?: string
  readonly multiple?: boolean
  readonly maxSize?: number // in MB
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "type">

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

export function AppFileUpload({
  name,
  label,
  containerClassName,
  fieldClassName,
  description,
  accept,
  multiple = true,
  maxSize = 10,
  ...nativeProps
}: Props) {
  const { control } = useFormContext()
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations("comps.fileInput")

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FileList | null) => void
  ) => {
    const selectedFiles = event.target.files
    if (!selectedFiles) return

    const fileArray = Array.from(selectedFiles)

    // Validate file sizes
    const invalidFiles = fileArray.filter(
      (file) => file.size > maxSize * 1024 * 1024
    )

    if (invalidFiles.length > 0) {
      alert(t("maxSizeExceeded", { maxSize }))

      return
    }

    setFiles(fileArray)
    onChange(selectedFiles)
  }

  const removeFile = (
    index: number,
    onChange: (value: FileList | null) => void
  ) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)

    // Create a new FileList-like object
    const dataTransfer = new DataTransfer()
    newFiles.forEach((file) => dataTransfer.items.add(file))

    onChange(dataTransfer.files.length > 0 ? dataTransfer.files : null)

    // Reset the input if all files are removed
    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({
        field: { onChange, value: _value, ...field },
        fieldState,
      }) => (
        <FormItem className={cn(containerClassName)}>
          <AppFormLabel
            fieldState={fieldState}
            label={label}
            required={nativeProps.required}
          />

          <FormControl>
            <div className="space-y-4">
              <div
                className={cn(
                  "hover:border-primary-700 rounded-md border-2 border-dashed p-6 text-center transition-colors",
                  {
                    "border-secondary-400": fieldState.invalid,
                    "border-gray-300": !fieldState.invalid,
                  },
                  fieldClassName
                )}
              >
                <input
                  {...field}
                  {...nativeProps}
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  onChange={(e) => handleFileChange(e, onChange)}
                  className="hidden"
                  id={`file-upload-${name}`}
                />
                <label
                  htmlFor={`file-upload-${name}`}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10" />
                    <div className="text-sm text-gray-600">
                      <span className="text-primary-700 font-medium">
                        {t("clickToUpload")}
                      </span>
                      <span className="hidden sm:inline">
                        {" "}
                        {t("orDragAndDrop")}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("acceptedFileTypes", {
                        fileTypes: accept || t("anyFileType"),
                        maxSize,
                      })}
                    </div>
                  </div>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index, onChange)}
                        className="h-8 w-8 p-0 hover:bg-gray-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>

          <AppFormDescription description={description} />

          <FormMessage className="text-secondary-400" />
        </FormItem>
      )}
    />
  )
}
