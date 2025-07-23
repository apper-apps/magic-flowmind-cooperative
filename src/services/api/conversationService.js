import conversationsData from "@/services/mockData/conversations.json";

class ConversationService {
  constructor() {
    this.conversations = [...conversationsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.conversations]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const conversation = this.conversations.find(c => c.Id === parseInt(id));
        if (conversation) {
          resolve({ ...conversation });
        } else {
          reject(new Error("Conversation not found"));
        }
      }, 200);
    });
  }

  async create(conversationData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newConversation = {
          Id: Math.max(...this.conversations.map(c => c.Id), 0) + 1,
          userId: "user-1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...conversationData
        };
        
        this.conversations.unshift(newConversation);
        resolve({ ...newConversation });
      }, 300);
    });
  }

  async update(id, conversationData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.conversations.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          this.conversations[index] = {
            ...this.conversations[index],
            ...conversationData,
            updatedAt: new Date().toISOString()
          };
          resolve({ ...this.conversations[index] });
        } else {
          reject(new Error("Conversation not found"));
        }
      }, 250);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.conversations.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.conversations.splice(index, 1)[0];
          resolve(deleted);
        } else {
          reject(new Error("Conversation not found"));
        }
      }, 200);
    });
  }
}

export default new ConversationService();