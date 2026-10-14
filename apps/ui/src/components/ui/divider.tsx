import { cn } from "@/lib/styles"

export interface DividerProps {
  readonly className?: string
  readonly orientation?: "horizontal" | "vertical"
  readonly variant?: "default" | "light" | "dark"
}

export function Divider({
  className,
  orientation = "horizontal",
  variant = "default",
}: DividerProps) {
  const variantStyles = {
    default: "bg-white/20",
    light: "bg-white/10",
    dark: "bg-white/40",
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        variantStyles[variant],
        className
      )}
    />
  )
}

Divider.displayName = "Divider"

export default Divider
