import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import templateService from "@/services/api/templateService";
import workflowService from "@/services/api/workflowService";
import { toast } from "react-toastify";

const TemplateGallery = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "productivity", label: "Productivity" },
    { value: "integration", label: "Integration" },
    { value: "automation", label: "Automation" },
    { value: "data", label: "Data Processing" }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError("Failed to load templates");
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

setFilteredTemplates(filtered);
  };

  const handleUseTemplate = async (template) => {
    try {
      const newWorkflow = {
        name: `${template.name} (Copy)`,
        description: template.description,
        nodes: template.nodes || [],
        connections: template.connections || [],
        status: "draft"
      };

      await workflowService.create(newWorkflow);
      toast.success(`Template "${template.name}" added to your workflows`);
    } catch (err) {
      toast.error("Failed to use template");
    }
  };
  if (loading) return <Loading variant="workflow" />;
  if (error) return <Error message={error} onRetry={loadTemplates} />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          Workflow Templates
        </h1>
        <p className="text-slate-400">
          Pre-built automation workflows to get you started quickly
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBar
            placeholder="Search templates..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Empty 
          variant="templates"
          title={searchQuery ? "No templates found" : "No templates available"}
          message={searchQuery ? `No templates match "${searchQuery}"` : "Templates will appear here once they're loaded"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl p-6 border border-slate-700 hover:border-primary-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${
                  template.category === "productivity" ? "from-primary-500 to-secondary-500" :
                  template.category === "integration" ? "from-accent-500 to-emerald-500" :
                  template.category === "automation" ? "from-secondary-500 to-purple-600" :
                  "from-amber-500 to-orange-500"
                } rounded-xl flex items-center justify-center`}>
                  <ApperIcon name={template.icon} size={24} className="text-white" />
                </div>
                <Badge variant="primary" size="sm">
                  {template.category}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {template.name}
              </h3>
              
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                {template.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Layers" size={12} />
                    <span>{template.nodeCount} nodes</span>
                  </div>
                  {template.complexity && (
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Zap" size={12} />
                      <span>{template.complexity}</span>
                    </div>
                  )}
                </div>
                {template.popular && (
                  <Badge variant="success" size="sm">
                    Popular
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2">
<Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleUseTemplate(template)}
                >
                  <ApperIcon name="Copy" size={14} className="mr-2" />
                  Use Template
                </Button>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Eye" size={14} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;