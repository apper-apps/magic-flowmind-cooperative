import dashboardData from "@/services/mockData/dashboard.json";

class DashboardService {
  constructor() {
    this.data = { ...dashboardData };
  }

  async getStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.data });
      }, 350);
    });
  }

  async getRecentActivity() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.data.recentActivity]);
      }, 250);
    });
  }
}

export default new DashboardService();