import templatesData from "@/services/mockData/templates.json";

class TemplateService {
  constructor() {
    this.templates = [...templatesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.templates]);
      }, 400);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const template = this.templates.find(t => t.Id === parseInt(id));
        if (template) {
          resolve({ ...template });
        } else {
          reject(new Error("Template not found"));
        }
      }, 200);
    });
  }

  async create(templateData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTemplate = {
          Id: Math.max(...this.templates.map(t => t.Id), 0) + 1,
          ...templateData
        };
        
        this.templates.unshift(newTemplate);
        resolve({ ...newTemplate });
      }, 300);
    });
  }

  async update(id, templateData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.templates.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          this.templates[index] = {
            ...this.templates[index],
            ...templateData
          };
          resolve({ ...this.templates[index] });
        } else {
          reject(new Error("Template not found"));
        }
      }, 250);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.templates.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.templates.splice(index, 1)[0];
          resolve(deleted);
        } else {
          reject(new Error("Template not found"));
        }
      }, 200);
    });
  }
}

export default new TemplateService();