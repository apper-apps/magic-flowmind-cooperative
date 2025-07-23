import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import workflowService from "@/services/api/workflowService";
import { toast } from "react-toastify";

const WorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodePanel, setShowNodePanel] = useState(false);

  const nodeTypes = [
    { type: "trigger", label: "HTTP Trigger", icon: "Webhook", color: "accent" },
    { type: "action", label: "HTTP Request", icon: "Globe", color: "primary" },
    { type: "condition", label: "Condition", icon: "GitBranch", color: "secondary" },
    { type: "transform", label: "Transform Data", icon: "RefreshCw", color: "warning" }
  ];

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await workflowService.getAll();
      setWorkflows(data);
      if (data.length > 0) {
        setActiveWorkflow(data[0]);
      }
    } catch (err) {
      setError("Failed to load workflows");
      toast.error("Failed to load workflows");
    } finally {
      setLoading(false);
    }
  };

  const createNewWorkflow = async () => {
    try {
      const newWorkflow = {
        name: "New Workflow",
        description: "A new automation workflow",
        nodes: [],
        connections: [],
        status: "draft"
      };
      
      const created = await workflowService.create(newWorkflow);
      setWorkflows(prev => [created, ...prev]);
      setActiveWorkflow(created);
      toast.success("New workflow created");
    } catch (err) {
      toast.error("Failed to create workflow");
    }
  };

  const addNode = (nodeType) => {
    if (!activeWorkflow) return;

    const newNode = {
      Id: Date.now(),
      type: nodeType.type,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: {
        label: nodeType.label,
        config: {}
      },
      inputs: nodeType.type === "trigger" ? [] : ["input"],
      outputs: ["output"]
    };

    const updatedWorkflow = {
      ...activeWorkflow,
      nodes: [...activeWorkflow.nodes, newNode]
    };

    setActiveWorkflow(updatedWorkflow);
    updateWorkflow(updatedWorkflow);
  };

  const updateWorkflow = async (workflow) => {
    try {
      await workflowService.update(workflow.Id, workflow);
      setWorkflows(prev => 
        prev.map(w => w.Id === workflow.Id ? workflow : w)
      );
    } catch (err) {
      toast.error("Failed to update workflow");
    }
  };

  const runWorkflow = async () => {
    if (!activeWorkflow) return;

    try {
      toast.info("Starting workflow execution...");
      
      // Simulate workflow execution
      const updatedWorkflow = {
        ...activeWorkflow,
        status: "running",
        lastRun: new Date().toISOString()
      };
      
      setActiveWorkflow(updatedWorkflow);
      updateWorkflow(updatedWorkflow);

      setTimeout(() => {
        const completedWorkflow = {
          ...updatedWorkflow,
          status: "success"
        };
        setActiveWorkflow(completedWorkflow);
        updateWorkflow(completedWorkflow);
        toast.success("Workflow completed successfully!");
      }, 3000);

    } catch (err) {
      toast.error("Failed to run workflow");
    }
  };

  if (loading) return <Loading variant="workflow" />;
  if (error) return <Error message={error} onRetry={loadWorkflows} />;

  return (
    <div className="flex h-full">
      {/* Workflows Sidebar */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Workflows</h2>
            <Button size="sm" onClick={createNewWorkflow}>
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {workflows.length === 0 ? (
            <Empty 
              variant="workflow"
              actionLabel="Create Workflow"
              onAction={createNewWorkflow}
            />
          ) : (
            workflows.map((workflow) => (
              <motion.div
                key={workflow.Id}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  activeWorkflow?.Id === workflow.Id
                    ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30"
                    : "hover:bg-slate-800/50"
                }`}
                onClick={() => setActiveWorkflow(workflow)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-white truncate">
                    {workflow.name}
                  </div>
                  <Badge variant={workflow.status === "success" ? "success" : workflow.status === "error" ? "danger" : "default"}>
                    {workflow.status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  {workflow.description}
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <ApperIcon name="Layers" size={12} />
                  <span>{workflow.nodes?.length || 0} nodes</span>
                  {workflow.lastRun && (
                    <>
                      <span>•</span>
                      <span>Last run: {new Date(workflow.lastRun).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="flex-1 flex flex-col">
        {activeWorkflow ? (
          <>
            {/* Toolbar */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <Input
                  value={activeWorkflow.name}
                  onChange={(e) => {
                    const updated = { ...activeWorkflow, name: e.target.value };
                    setActiveWorkflow(updated);
                    updateWorkflow(updated);
                  }}
                  className="w-64"
                />
                <Badge variant={activeWorkflow.status === "success" ? "success" : activeWorkflow.status === "error" ? "danger" : "default"}>
                  {activeWorkflow.status}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  Save
                </Button>
                <Button 
                  onClick={runWorkflow}
                  disabled={activeWorkflow.status === "running"}
                  size="sm"
                >
                  {activeWorkflow.status === "running" ? (
                    <ApperIcon name="Loader" size={16} className="mr-2 animate-spin" />
                  ) : (
                    <ApperIcon name="Play" size={16} className="mr-2" />
                  )}
                  Run
                </Button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex">
              {/* Node Palette */}
              <div className="w-64 border-r border-slate-800 p-4">
                <h3 className="text-sm font-medium text-white mb-4">Add Nodes</h3>
                <div className="space-y-2">
                  {nodeTypes.map((nodeType) => (
                    <motion.div
                      key={nodeType.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="glass-light p-3 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all"
                      onClick={() => addNode(nodeType)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${
                          nodeType.color === "accent" ? "from-accent-500 to-emerald-500" :
                          nodeType.color === "primary" ? "from-primary-500 to-secondary-500" :
                          nodeType.color === "secondary" ? "from-secondary-500 to-purple-600" :
                          "from-amber-500 to-orange-500"
                        } rounded-lg flex items-center justify-center`}>
                          <ApperIcon name={nodeType.icon} size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{nodeType.label}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 relative overflow-hidden workflow-canvas">
                {activeWorkflow.nodes?.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Empty 
                      icon="Workflow"
                      title="Empty Canvas"
                      message="Add nodes from the palette to start building your workflow"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 p-8">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {activeWorkflow.nodes?.map((node) => (
                      <motion.div
                        key={node.Id}
                        drag
                        dragMomentum={false}
                        whileHover={{ scale: 1.05 }}
                        className="absolute glass rounded-xl p-4 cursor-move min-w-[200px] border border-slate-700 hover:border-primary-500/50 transition-all"
                        style={{
                          left: node.position.x,
                          top: node.position.y
                        }}
                        onClick={() => {
                          setSelectedNode(node);
                          setShowNodePanel(true);
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-8 h-8 bg-gradient-to-r ${
                            node.type === "trigger" ? "from-accent-500 to-emerald-500" :
                            node.type === "action" ? "from-primary-500 to-secondary-500" :
                            node.type === "condition" ? "from-secondary-500 to-purple-600" :
                            "from-amber-500 to-orange-500"
                          } rounded-lg flex items-center justify-center`}>
                            <ApperIcon 
                              name={nodeTypes.find(t => t.type === node.type)?.icon || "Box"} 
                              size={16} 
                              className="text-white" 
                            />
                          </div>
                          <div className="text-sm font-medium text-white">
                            {node.data.label}
                          </div>
                        </div>
                        
                        {/* Connection Points */}
                        {node.inputs?.length > 0 && (
                          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-slate-600 rounded-full border-2 border-slate-400" />
                        )}
                        {node.outputs?.length > 0 && (
                          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full border-2 border-primary-400" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Empty 
              variant="workflow"
              actionLabel="Create Workflow"
              onAction={createNewWorkflow}
            />
          </div>
        )}
      </div>

      {/* Node Configuration Panel */}
      {showNodePanel && selectedNode && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="w-80 border-l border-slate-800 bg-slate-900/50 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Node Configuration</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNodePanel(false)}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <div className="space-y-4">
<div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Node Name
              </label>
              <Input 
                value={selectedNode?.data?.label || ''} 
                onChange={(e) => {
                  if (selectedNode) {
                    setSelectedNode({
                      ...selectedNode,
                      data: {
                        ...selectedNode.data,
                        label: e.target.value
                      }
                    });
                  }
                }}
                placeholder="Enter node name"
              />
            </div>

            {selectedNode.type === "action" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    HTTP Method
                  </label>
                  <Select>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL
                  </label>
                  <Input placeholder="https://api.example.com/endpoint" />
                </div>
              </>
            )}

            {selectedNode.type === "condition" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Condition
                </label>
                <Select>
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greater_than">Greater Than</option>
                </Select>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WorkflowBuilder;