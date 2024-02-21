import { defineStore } from 'pinia';
import axios from 'axios'; // Import Axios for making HTTP requests

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: false,
    token: null,
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken;
      this.isAuthenticated = !!newToken;
    },
    async checkAuthStatus() {
      try {
        const response = await axios.get('https://localhost:7250/status');
        this.isAuthenticated = response.data.isAuthenticated;
      } catch (error) {
        console.error("Error checking authentication status", error);
        this.isAuthenticated = false;
      }
    },
    async login() {
      // Redirect to the backend login URL
      window.location.href = 'https://localhost:7250/login';
    },
    async logout() {
      // Redirect to the backend logout URL
      // window.location.href = 'https://localhost:7250/logout';
      window.location.href = 'https://localhost:7250/login';
    },
  }
});
