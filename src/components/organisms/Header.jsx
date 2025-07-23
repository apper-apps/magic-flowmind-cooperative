import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuClick, showMenuButton = true }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={18} />
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={18} />
          </Button>
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;