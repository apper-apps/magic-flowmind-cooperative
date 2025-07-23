import React from "react";
import { motion } from "framer-motion";
import WorkflowBuilder from "@/components/organisms/WorkflowBuilder";

const Workflows = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <WorkflowBuilder />
    </motion.div>
  );
};

export default Workflows;