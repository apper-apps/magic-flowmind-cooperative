import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import dashboardService from "@/services/api/dashboardService";
import { toast } from "react-toastify";

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dashboardService.getStats();
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
    } catch (err) {
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  if (!stats) return null;

  const statCards = [
    {
      title: "Total Conversations",
      value: stats.totalConversations,
      change: stats.conversationsChange,
      icon: "MessageSquare",
      color: "from-primary-500 to-secondary-500"
    },
    {
      title: "Active Workflows",
      value: stats.activeWorkflows,
      change: stats.workflowsChange,
      icon: "Workflow",
      color: "from-accent-500 to-emerald-500"
    },
    {
      title: "API Calls",
      value: stats.apiCalls,
      change: stats.apiCallsChange,
      icon: "Globe",
      color: "from-secondary-500 to-purple-600"
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: stats.successRateChange,
      icon: "TrendingUp",
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass rounded-xl p-6 border border-slate-700 hover:border-primary-500/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <ApperIcon name={stat.icon} size={24} className="text-white" />
              </div>
              {stat.change && (
                <Badge 
                  variant={stat.change > 0 ? "success" : "danger"}
                  size="sm"
                >
                  {stat.change > 0 ? "+" : ""}{stat.change}%
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-400">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <ApperIcon name="Activity" size={20} className="text-primary-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.Id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className={`w-8 h-8 bg-gradient-to-r ${
                  activity.type === "chat" ? "from-primary-500 to-secondary-500" :
                  activity.type === "workflow" ? "from-accent-500 to-emerald-500" :
                  "from-secondary-500 to-purple-600"
                } rounded-lg flex items-center justify-center`}>
                  <ApperIcon 
                    name={activity.type === "chat" ? "MessageSquare" : activity.type === "workflow" ? "Workflow" : "Settings"} 
                    size={14} 
                    className="text-white" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {activity.description}
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  {activity.timestamp}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <ApperIcon name="Zap" size={20} className="text-accent-400" />
          </div>
          
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl border border-primary-500/30 hover:border-primary-500/50 transition-all text-left group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ApperIcon name="MessageSquare" size={18} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Start New Chat</div>
                <div className="text-xs text-slate-400">Begin AI conversation</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-accent-500/20 to-emerald-500/20 rounded-xl border border-accent-500/30 hover:border-accent-500/50 transition-all text-left group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ApperIcon name="Workflow" size={18} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Create Workflow</div>
                <div className="text-xs text-slate-400">Build automation</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-secondary-500/20 to-purple-600/20 rounded-xl border border-secondary-500/30 hover:border-secondary-500/50 transition-all text-left group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ApperIcon name="Layout" size={18} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Browse Templates</div>
                <div className="text-xs text-slate-400">Explore pre-built flows</div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;