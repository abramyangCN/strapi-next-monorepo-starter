"use client"

import type { Data } from "@repo/strapi-types"
import type React from "react"
import { useState } from "react"

import AppLink from "@/components/elementary/AppLink"
import { MoveRightSVG } from "@/components/elementary/icons"

export interface StrapiLinkProps {
  readonly component: Data.Component<"utilities.link"> | undefined | null
  readonly children?: React.ReactNode
  readonly className?: string
  readonly hideWhenMissing?: boolean
  readonly variant?: "primary" | "default"
}

const variantStyles = {
  primary:
    "inline-flex p-3 h-12.5 items-center justify-center min-w-45 border border-white text-white bg-primary-700 rounded-none hover:no-underline",
  default: "hover:no-underline hover:text-secondary-400",
}

interface PrimaryLinkProps {
  href: string
  newTab?: boolean | null
  combinedClassName: string
  children: React.ReactNode
}

function PrimaryLink({
  href,
  newTab,
  combinedClassName,
  children,
}: PrimaryLinkProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      className="group bg-primary-700 relative inline-flex overflow-hidden rounded-none border border-white"
      onMouseEnter={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
      onFocus={() => {
        setIsHovered(true)
      }}
      onBlur={() => {
        setIsHovered(false)
        setIsActive(false)
      }}
      onMouseDown={() => {
        setIsActive(true)
      }}
      onMouseUp={() => {
        setIsActive(false)
      }}
      onMouseOut={() => {
        setIsActive(false)
      }}
    >
      <span
        className="bg-primary-500 pointer-events-none absolute inset-0 z-0 transition-opacity duration-800"
        style={{ opacity: isHovered ? 0.5 : 0 }}
      />
      <span
        className="bg-primary-100 pointer-events-none absolute top-1/2 left-1/2 z-0 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          transform: isActive ? "scale(2)" : "scale(0)",
          opacity: isActive ? 0 : 0.8,
          transition: isActive ? "all 800ms ease-out" : "none",
        }}
      />
      <AppLink
        href={href}
        openExternalInNewTab={newTab ?? false}
        className={`${combinedClassName} relative z-10 border-0 bg-transparent`}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
      >
        {children}
        <MoveRightSVG className="size-8 transition-transform duration-300 group-hover:translate-x-1" />
      </AppLink>
    </div>
  )
}

export function StrapiLink({
  component,
  children,
  className,
  hideWhenMissing,
  variant = "default",
}: StrapiLinkProps) {
  if (component == null && hideWhenMissing) {
    return null
  }

  if (component?.href == null) {
    return children ?? component?.label ?? null
  }

  const variantClassName = variantStyles[variant]
  const combinedClassName = variantClassName
    ? `${variantClassName} ${className || ""}`
    : className

  const content = children ?? component.label

  if (variant === "primary") {
    return (
      <PrimaryLink
        href={component.href}
        newTab={component.newTab}
        combinedClassName={combinedClassName ?? ""}
      >
        {content}
      </PrimaryLink>
    )
  }

  return (
    <AppLink
      href={component.href}
      openExternalInNewTab={component.newTab ?? false}
      className={combinedClassName}
      target={component.newTab ? "_blank" : undefined}
      rel={component.newTab ? "noopener noreferrer" : undefined}
    >
      {content}
    </AppLink>
  )
}

StrapiLink.displayName = "StrapiLink"

export default StrapiLink
