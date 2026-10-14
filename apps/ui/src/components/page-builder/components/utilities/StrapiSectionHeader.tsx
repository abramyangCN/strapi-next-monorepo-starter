import { cn } from "@/lib/styles"

interface StrapiSectionTitleProps {
  title?: string | null
  className?: string
}

export function StrapiSectionTitle({
  title,
  className,
}: StrapiSectionTitleProps) {
  if (!title) {
    return null
  }

  return (
    <h2
      className={cn(
        "mb-3 text-3xl font-bold text-black md:mb-4 md:text-4xl lg:text-5xl",
        className
      )}
    >
      {title}
    </h2>
  )
}

interface StrapiSectionDescriptionProps {
  description?: string | null
  className?: string
}

export function StrapiSectionDescription({
  description,
  className,
}: StrapiSectionDescriptionProps) {
  if (!description) {
    return null
  }

  return (
    <p
      className={cn(
        "text-muted mx-auto max-w-4xl text-sm md:text-lg lg:text-2xl",
        className
      )}
    >
      {description}
    </p>
  )
}
