import workflowsData from "@/services/mockData/workflows.json";

class WorkflowService {
  constructor() {
    this.workflows = [...workflowsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.workflows]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const workflow = this.workflows.find(w => w.Id === parseInt(id));
        if (workflow) {
          resolve({ ...workflow });
        } else {
          reject(new Error("Workflow not found"));
        }
      }, 200);
    });
  }

  async create(workflowData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newWorkflow = {
          Id: Math.max(...this.workflows.map(w => w.Id), 0) + 1,
          userId: "user-1",
          createdAt: new Date().toISOString(),
          lastRun: null,
          ...workflowData
        };
        
        this.workflows.unshift(newWorkflow);
        resolve({ ...newWorkflow });
      }, 300);
    });
  }

  async update(id, workflowData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.workflows.findIndex(w => w.Id === parseInt(id));
        if (index !== -1) {
          this.workflows[index] = {
            ...this.workflows[index],
            ...workflowData
          };
          resolve({ ...this.workflows[index] });
        } else {
          reject(new Error("Workflow not found"));
        }
      }, 250);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.workflows.findIndex(w => w.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.workflows.splice(index, 1)[0];
          resolve(deleted);
        } else {
          reject(new Error("Workflow not found"));
        }
      }, 200);
    });
  }
}

export default new WorkflowService();