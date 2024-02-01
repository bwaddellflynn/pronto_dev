import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import axios from 'axios';

export const useMyStore = defineStore({
  id: 'myStore',
  state: () => ({
    contracts: [],
    issues: [],
    frequencies: [
      { id: 1, value: 'on-demand', label: 'On-Demand' },
      { id: 2, value: 'bi-weekly', label: 'Bi-weekly' },
      { id: 3, value: 'monthly', label: 'Monthly' },
      { id: 4, value: 'quarterly', label: 'Quarterly' },
      { id: 5, value: 'yearly', label: 'Yearly' },
    ],
    selectedContract: '',
    selectedFrequency: '',
    startDate: null,
    endDate: null,
    UTCStartDate: null,
    UTCEndDate: null,
    reportNotes: '',
  }),
  actions: {
    convertToEpoch(dateStr) {
      const date = new Date(dateStr);
      return Math.floor(date.getTime() / 1000);
    },
    // Selects a contract
    selectContract(contractId) {
      this.selectedContract = contractId;
    },
    // Selects a frequency
    selectFrequency(frequencyId) {
      this.selectedFrequency = frequencyId;
    },
    // Updates start date and converts to UTC
    updateStartDate(startDate) {
      this.startDate = startDate;
      console.log(this.startDate);

      const startEpoch = this.convertToEpoch(startDate);
      this.UTCStartDate = startEpoch;
      console.log(this.UTCStartDate);
    },
    // Updates end date and converts to UTC
    updateEndDate(endDate) {
      this.endDate = endDate;
      console.log(this.endDate);
  
      const endEpoch = this.convertToEpoch(endDate);
      this.UTCEndDate = endEpoch;
      console.log(this.UTCEndDate);
    },
    setNote(newNote) {
      this.reportNotes = newNote;
    },
    async fetchContracts() {
      const authStore = useAuthStore();
      if (!authStore.token) {
        throw new Error('Authentication token is not available.');
      }

      try {
        const response = await axios. get('http://localhost:5222/accelo/contracts', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }); 
        this.contracts = response.data;
      } catch (error) {
        console.error('Error fetching contracts:', error);
        // Handle error, e.g., show notification, redirect to login, etc.
      }
    },
    async fetchIssues(companyId, UTCStartDate, UTCEndDate) {
      const authStore = useAuthStore();
      if (!authStore.token || !companyId || !UTCStartDate || !UTCEndDate) {
        this.error = 'Missing required fields';
        return;
      }
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:5222/api/accelo/issues', {
          params: { companyId, start_date: UTCStartDate, end_date: UTCEndDate },
          headers: { 'Authorization': `Bearer ${authStore.token}` },
        });
        this.issues = response.data.response;
      } 
      catch (error) {
        this.error = error.message || 'Error fetching issues';
      } 
      finally {
        this.loading = false;
      }
    },
  },
  getters: {
    // Getter for the label of the selected frequency
    selectedFrequencyLabel() {
      const frequency = this.frequencies.find(f => f.id === this.selectedFrequency);
      return frequency ? frequency.label : '';
    },
    // Getter for the name of the selected company
    selectedCompanyName() {
      const contract = this.contracts.find(f => f.id === this.selectedContract);
      return contract ? contract.company.name : '';
    },
    // Getter for formatted start date
    formattedStartDate() {
      if (!this.startDate) return 'Not set';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(this.startDate).toLocaleDateString('en-US', options);
    },
    // Getter for formatted end date
    formattedEndDate() {
      if (!this.endDate) return 'Not set';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(this.endDate).toLocaleDateString('en-US', options);
    },
  },
});