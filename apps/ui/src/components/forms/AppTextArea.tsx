"use client"

import type React from "react"
import { useFormContext } from "react-hook-form"

import { AppFormDescription } from "@/components/forms/AppFormDescription"
import { AppFormLabel } from "@/components/forms/AppFormLabel"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/styles"

type Props = {
  readonly name: string
  readonly label?: React.ReactNode
  readonly containerClassName?: string
  readonly fieldClassName?: string
  readonly description?: React.ReactNode
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">

export function AppTextArea({
  name,
  label,
  containerClassName,
  fieldClassName,
  description,
  ...nativeProps
}: Props) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn(containerClassName)}>
          <AppFormLabel
            fieldState={fieldState}
            label={label}
            required={nativeProps.required}
          />

          <FormControl>
            <div className="relative flex items-stretch overflow-hidden">
              <Textarea
                {...field}
                {...nativeProps}
                value={field.value ?? ""}
                onChange={field.onChange} // eslint-disable-line react/jsx-handler-names -- react-hook-form API
                className={cn(
                  "border-input w-full rounded-none! border-gray-200 bg-white px-4 text-base ease-in-out",
                  {
                    "border-secondary-400": fieldState.invalid,
                  },
                  fieldClassName
                )}
              />
            </div>
          </FormControl>

          <AppFormDescription description={description} />

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
