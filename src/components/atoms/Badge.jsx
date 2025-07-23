import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "default",
  className,
  ...props 
}) => {
  const variants = {
    default: "bg-slate-800 text-slate-200 border-slate-600",
    primary: "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-300 border-primary-500/30",
    success: "bg-gradient-to-r from-accent-500/20 to-emerald-500/20 text-accent-300 border-accent-500/30",
    warning: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30",
    danger: "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;