import * as React from "react"
 import {HTMLMotionProps, motion} from "framer-motion"
import { cn } from "../../lib/utils"
 
export type InputProps = HTMLMotionProps<"input"> & {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
 
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, ...props }, ref) => {
    return (
      <motion.input
      layout
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-accent2 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={onChange}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
 
export { Input }

