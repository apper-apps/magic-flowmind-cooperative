import React from "react";
import { motion } from "framer-motion";
import TemplateGallery from "@/components/organisms/TemplateGallery";

const Templates = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <TemplateGallery />
    </motion.div>
  );
};

export default Templates;