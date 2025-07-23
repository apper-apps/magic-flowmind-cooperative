import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatusIndicator = ({ status, className, showLabel = true }) => {
  const statusConfig = {
    idle: {
      color: "text-slate-400",
      bgColor: "bg-slate-400",
      icon: "Circle",
      label: "Idle"
    },
    running: {
      color: "text-blue-400",
      bgColor: "bg-blue-400",
      icon: "Play",
      label: "Running"
    },
    success: {
      color: "text-accent-400",
      bgColor: "bg-accent-400",
      icon: "CheckCircle",
      label: "Success"
    },
    error: {
      color: "text-red-400",
      bgColor: "bg-red-400",
      icon: "XCircle",
      label: "Error"
    },
    warning: {
      color: "text-amber-400",
      bgColor: "bg-amber-400",
      icon: "AlertTriangle",
      label: "Warning"
    }
  };

  const config = statusConfig[status] || statusConfig.idle;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        <ApperIcon 
          name={config.icon} 
          size={16} 
          className={config.color} 
        />
        {status === "running" && (
          <div className={cn("absolute inset-0 rounded-full animate-ping", config.bgColor, "opacity-25")} />
        )}
      </div>
      {showLabel && (
        <span className={cn("text-sm font-medium", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;