import { cn } from "@/lib/styles"

interface SectionProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly style?: React.CSSProperties
}

export function Section({ children, className, style }: SectionProps) {
  return (
    <section className={cn("w-full py-16 md:py-16", className)} style={style}>
      {children}
    </section>
  )
}

Section.displayName = "Section"
