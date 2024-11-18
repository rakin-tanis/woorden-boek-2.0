"use client"

import React from "react"
import { cn } from "@/lib/utils"
import Spinner from "./Spinner"

const buttonVariants = {
  default: "bg-blue-500 text-white hover:bg-blue-600",
  outline: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  // Add more variants as needed
}

const Button = React.forwardRef<
  React.ElementRef<"button">,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof buttonVariants,
    isLoading?: boolean
  }
>(({ className, variant = "default", isLoading, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "rounded-md px-4 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        buttonVariants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {props.children}
        </>
      )}
    </button>
  )
})
Button.displayName = "Button"

export { Button }