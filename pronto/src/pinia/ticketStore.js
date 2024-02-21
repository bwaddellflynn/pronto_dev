import { defineStore } from 'pinia';
import { useAuthStore } from './authStore'; 
import axios from 'axios';

export const useTicketStore = defineStore('ticketStore', {
  state: () => ({
    tickets: [],
    isLoading: false,
    error: null
  }),
  actions: {
      async fetchTicketsByPeriod(issueIds, startDate, endDate) {
      const authStore = useAuthStore();
      if (!authStore.token) {
        throw new Error('Authentication token is not available.');
      }

      try {
        this.isLoading = true;
        const response = await axios.get('https://localhost:7250/accelodsa/issues', {
          params: { issueId: issueIds, startDate, endDate }, 
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        this.tickets = response.data;
        console.log("Tickets: ", this.tickets); 
        this.error = null;
      } catch (err) {
        this.error = err.message;
        this.tickets = [];
      } finally {
        this.isLoading = false;
      }
    },
    async fetchTicketsByCompany(companyId, startDate, endDate) {
      const authStore = useAuthStore();
      if (!authStore.token) {
        throw new Error('Authentication token is not available.');
      }

      try {
        this.isLoading = true;
        const response = await axios.get('https://pronto-middleware.azurewebsites.net/accelogeneral/issues', {
          params: { companyId, startDate, endDate },
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        this.tickets = response.data;
        this.error = null;
      } catch (err) {
        this.error = err.message;
        this.tickets = [];
      } finally {
        this.isLoading = false;
      }
    },
    setTickets(list) {
      this.tickets = list;
    },
  },
  getters: {
    filteredTickets: (state) => (status) => {
      return state.tickets.filter(ticket => ticket.status === status);
    }
  }
});
