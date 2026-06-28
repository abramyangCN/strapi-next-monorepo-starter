"use client"

import type { BaseSyntheticEvent } from "react"
import {
  type FieldValues,
  type SubmitErrorHandler,
  type UseFormReturn,
  FormProvider,
} from "react-hook-form"

import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"
import { cn } from "@/lib/styles"

interface Props<T extends FieldValues = FieldValues> {
  readonly form: UseFormReturn<T>
  readonly onSubmit: (
    values: T,

    e?: BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => void
  readonly onError?: SubmitErrorHandler<T>
  readonly children: React.ReactNode
  readonly className?: string
  readonly fieldsetClassName?: string
  readonly id?: string
  readonly disabled?: boolean
}

export function AppForm<T extends FieldValues = FieldValues>({
  onSubmit,
  onError = () => {
    /* empty */
  },
  children,
  className,
  id,
  form,
  fieldsetClassName,
  disabled,
}: Props<T>) {
  removeThisWhenYouNeedMe("AppForm")

  const { handleSubmit } = form

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className={className}
        id={id}
        noValidate
      >
        <fieldset
          disabled={disabled}
          className={cn("flex w-full flex-col gap-4", fieldsetClassName)}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  )
}
