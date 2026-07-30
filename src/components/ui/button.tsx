import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",

        outline:
          "border-orange-500 text-orange-600 bg-white hover:bg-orange-50",

        secondary:
          "bg-orange-100 text-orange-700 hover:bg-orange-200",

        ghost:
          "hover:bg-orange-50 hover:text-orange-600",

        destructive:
          "bg-red-100 text-red-600 hover:bg-red-200",

        link:
          "text-orange-600 underline-offset-4 hover:underline",
      },

      size: {
        default:
          "h-9 gap-1.5 px-4 rounded-md",

        xs:
          "h-6 gap-1 rounded-md px-2 text-xs",

        sm:
          "h-8 gap-1 px-3 rounded-md",

        lg:
          "h-10 gap-2 px-6 rounded-lg",

        icon:
          "size-9 rounded-md",

        "icon-xs":
          "size-6 rounded-md",

        "icon-sm":
          "size-8 rounded-md",

        "icon-lg":
          "size-10 rounded-lg",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>) {

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      {...props}
    />
  );
}


export {
  Button,
  buttonVariants,
};