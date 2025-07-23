import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MobileSidebar = ({ isOpen, onClose }) => {
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 w-80 h-full bg-background border-r border-slate-800 z-50 lg:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
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
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-slate-400" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-300 border border-primary-500/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      )
                    }
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-400">
                        {item.description}
                      </div>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;