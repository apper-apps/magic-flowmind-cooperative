import React from "react";
import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          Welcome to FlowMind AI
        </h1>
        <p className="text-slate-400">
          Your intelligent automation platform for AI conversations and workflow building
        </p>
      </div>

      <DashboardStats />
    </motion.div>
  );
};

export default Dashboard;