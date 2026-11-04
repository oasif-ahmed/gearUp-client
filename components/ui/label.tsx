"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-disabled:[&>svg]:opacity-50 group-disabled:cursor-not-allowed group-disabled:opacity-70 group-disabled:[&>svg]:opacity-50",
  {
    variants: {
      variant: {
        default: "text-foreground",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Label({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? LabelPrimitive.Root : "label"

  return (
    <Comp
      data-slot="label"
      className={cn(labelVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Label }