import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet",
  message = "Get started by creating something new",
  actionLabel = "Get Started",
  onAction,
  icon = "Sparkles",
  variant = "default"
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "chat":
        return {
          icon: "MessageSquare",
          title: "No conversations yet",
          message: "Start a conversation with AI to get intelligent responses and assistance"
        };
      case "workflow":
        return {
          icon: "Workflow",
          title: "No workflows created",
          message: "Build your first automation workflow to streamline your processes"
        };
      case "templates":
        return {
          icon: "Layout",
          title: "No templates available",
          message: "Templates will appear here once they're loaded"
        };
      default:
        return { icon, title, message };
    }
  };

  const variantConfig = getVariantStyles();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl flex items-center justify-center mb-4">
          <ApperIcon name={variantConfig.icon} size={40} className="text-primary-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center animate-pulse">
          <ApperIcon name="Plus" size={16} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
        {variantConfig.title}
      </h3>
      
      <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
        {variantConfig.message}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          size="lg"
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white border-0 shadow-lg shadow-primary-500/25"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;