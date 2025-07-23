import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "LayoutDashboard",
      description: "Overview & Analytics"
    },
    {
      name: "AI Chat",
      path: "/chat",
      icon: "MessageSquare",
      description: "Conversational AI"
    },
    {
      name: "Workflows",
      path: "/workflows",
      icon: "Workflow",
      description: "Automation Builder"
    },
    {
      name: "Templates",
      path: "/templates",
      icon: "Layout",
      description: "Pre-built Solutions"
    }
  ];

  return (
    <div className={cn("w-64 bg-background border-r border-slate-800", className)}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              FlowMind AI
            </h1>
            <p className="text-xs text-slate-400">Intelligent Platform</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative",
                    isActive
                      ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-300 border border-primary-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl border border-primary-500/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <ApperIcon 
                      name={item.icon} 
                      size={20}
                      className={isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-300"}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-400">
                        {item.description}
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Sparkles" size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Pro Features</div>
              <div className="text-xs text-slate-400">Unlock advanced tools</div>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-accent-500 to-emerald-500 h-2 rounded-full w-3/4"></div>
          </div>
          <div className="text-xs text-slate-400">75% of monthly usage</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;