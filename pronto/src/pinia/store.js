import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import axios from 'axios';

export const useMyStore = defineStore({
  id: 'myStore',
  state: () => ({
    contracts: [],
    companies: [],
    issues: [],
    affiliations: [],
    frequencies: [
      { id: 'On-Demand', value: 'On-Demand', label: 'On-Demand' },
      { id: 'Bi-Weekly', value: 'Bi-Weekly', label: 'Bi-weekly' },
      { id: 'Monthly', value: 'Monthly', label: 'Monthly' },
      { id: 'Quarterly', value: 'Quarterly', label: 'Quarterly' },
      { id: 'Yearly', value: 'Yearly', label: 'Yearly' },
      { id: 'Fortnightly', value: 'Fortnightly', label: 'Fortnightly' },
    ],
    selectedContract: '',
    selectedCompany: '',
    selectedFrequency: '',
    selectedFrequencyID:'',
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
      // Selects a company
    selectCompany(companyId) {
      this.selectedCompany = companyId;
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
        const response = await axios.get('https://localhost:7250/accelodsa/contracts', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        
        this.contracts = response.data;
        console.log(this.contracts);
    
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    },
    
    async fetchCompanies() {
      const authStore = useAuthStore();
      if (!authStore.token) {
        throw new Error('Authentication token is not available.');
      }

      try {
        const response = await axios. get('https://localhost:7250/accelogeneral/companies', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }); 
        this.companies = response.data;
      } catch (error) {
        console.error('Error fetching companies:', error);
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
        const response = await axios.get('https://localhost:7250/accelo/issues', {
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
    selectedContractName() {
      const contract = this.contracts.find(f => f.id === this.selectedContract);
      return contract ? contract.company.name : '';
    },
    selectedCompanyName() {
      const company = this.companies.find(f => f.id === this.selectedCompany);
      return company ? company.name : '';
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