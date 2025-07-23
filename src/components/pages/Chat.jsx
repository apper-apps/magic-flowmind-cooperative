import React from "react";
import { motion } from "framer-motion";
import ChatInterface from "@/components/organisms/ChatInterface";

const Chat = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <ChatInterface />
    </motion.div>
  );
};

export default Chat;