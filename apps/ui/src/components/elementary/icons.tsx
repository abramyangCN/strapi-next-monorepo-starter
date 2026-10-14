interface IconProps {
  readonly className?: string
  readonly fill?: string
}

export function MoveRightSVG({ className, fill = "currentColor" }: IconProps) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M116.5 142.2L112.9 137.9L154.4 102.8H32.2V97.1998H154.4L112.9 62.0998L116.5 57.7998L166.2 99.9998L116.5 142.2Z"
        fill={fill}
      />
    </svg>
  )
}

export function MoveUpRightSVG({
  className,
  fill = "currentColor",
}: IconProps) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M147.524 58.6492L148.024 54.4492L82.924 58.0492L83.224 63.5492L137.524 60.5492L48.824 144.649L52.624 148.649L141.324 64.5492L135.524 118.649L140.924 119.249L147.524 58.6492Z"
        fill={fill}
      />
    </svg>
  )
}
