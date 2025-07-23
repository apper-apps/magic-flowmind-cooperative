import React from "react";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const ModelSelector = ({ value, onChange, className }) => {
  const models = [
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: "Fast and efficient" },
    { value: "gpt-4", label: "GPT-4", description: "Most capable model" },
    { value: "claude-3", label: "Claude 3", description: "Excellent reasoning" }
  ];

  return (
    <div className={className}>
      <div className="flex items-center space-x-2 mb-2">
        <ApperIcon name="Cpu" size={16} className="text-primary-400" />
        <span className="text-sm font-medium text-slate-300">AI Model</span>
      </div>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {models.map((model) => (
          <option key={model.value} value={model.value}>
            {model.label} - {model.description}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default ModelSelector;