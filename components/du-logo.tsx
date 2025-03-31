import type { SVGProps } from "react"

export function DuLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" {...props}>
      <rect x="10" y="10" width="80" height="80" rx="5" fill="#2E1A73" stroke="none" />
      <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" strokeWidth="2" />
      <path d="M40 40 L60 40 L60 60 L40 60 Z" fill="none" stroke="white" strokeWidth="2" />
      <path d="M50 25 L50 75" fill="none" stroke="white" strokeWidth="2" />
      <path d="M25 50 L75 50" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="50" cy="50" r="5" fill="white" />
    </svg>
  )
}

