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
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/styles"

type Props = {
  readonly name: string
  readonly options: { label: string; value: string }[]
  readonly label?: React.ReactNode
  readonly placeholder?: string
  readonly containerClassName?: string
  readonly fieldClassName?: string
  readonly description?: React.ReactNode
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className">

export function AppSelect({
  name,
  options,
  label,
  placeholder,
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
      render={({ field, fieldState }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value
        )

        return (
          <FormItem className={cn(containerClassName)}>
            <AppFormLabel
              label={label}
              fieldState={fieldState}
              required={nativeProps.required}
            />

            <SelectComponent
              name={field.name}
              dir={(nativeProps.dir ?? "ltr") as "ltr" | "rtl"}
              disabled={nativeProps.disabled}
              required={nativeProps.required}
              value={field.value || undefined}
              onValueChange={field.onChange} // eslint-disable-line react/jsx-handler-names -- react-hook-form API
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "text-foreground h-14! w-full rounded-none! border-gray-200 bg-white px-4",
                    {
                      "border-secondary-400": fieldState.invalid,
                    },
                    fieldClassName
                  )}
                  tabIndex={nativeProps.tabIndex}
                  onBlur={field.onBlur}
                >
                  {selectedOption ? (
                    <SelectValue>{selectedOption.label}</SelectValue>
                  ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                  )}
                </SelectTrigger>
              </FormControl>

              <SelectContent
                className={cn(
                  "max-h-40 overflow-y-auto rounded-none! bg-white drop-shadow-xl"
                )}
              >
                {options.map((option) => (
                  <SelectItem value={option.value} key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectComponent>

            <AppFormDescription description={description} />

            <FormMessage className="text-secondary-400" />
          </FormItem>
        )
      }}
    />
  )
}
