"use client"

import React from "react"
import { Button } from "../../../components/ui/button"
import { cn } from "@/lib/utils"

export const BloodBankButton = React.forwardRef(
  ({ variant = "primary", size = "md", isLoading = false, children, className, disabled, ...props }, ref) => {
    const variantStyles = {
      primary: "bg-red-600 hover:bg-red-700 text-white",
      success: "bg-green-600 hover:bg-green-700 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      secondary: "bg-gray-400 hover:bg-gray-500 text-white",
      ghost: "text-gray-600 hover:bg-gray-100",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    }

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    }

    return (
      <Button
        ref={ref}
        className={cn(
          "transition-colors rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </Button>
    )
  },
)

BloodBankButton.displayName = "BloodBankButton"
