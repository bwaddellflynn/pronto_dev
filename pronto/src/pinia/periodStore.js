import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { useTicketStore } from './ticketStore';
import axios from 'axios';

export const usePeriodStore = defineStore('periodStore', {
  state: () => ({
    totalBudgeted: 0,
    usedThisQuarter: 0,
    usedThisPeriod: 0,
    remainingHours: 0,
    maxHours: 10,
    periods: [],
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchPeriods(contractId, startDate, endDate) {
      const authStore = useAuthStore();
      if (!authStore.token) {
        throw new Error('Authentication token is not available.');
      }

      try {
        this.isLoading = true;
        const response = await axios.get(`https://localhost:7250/accelodsa/periods`, {
          params: { contractId, startDate, endDate },
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        this.periods = response.data;
        console.log(this.periods);

        this.processPeriodData();

        // Extract issue IDs and call fetchTickets in ticketStore
        const issueIds = this.extractIssueIds();
        if (issueIds.length > 0) {
          const issueIdsString = issueIds.join(',');
          console.log("Issue ID's: ",  issueIdsString)
          const ticketStore = useTicketStore();
          await ticketStore.fetchTicketsByPeriod(issueIdsString, startDate, endDate);
        }

        this.error = null;
      } catch (err) {
        this.error = err.message;
        this.periods = [];
      } finally {
        this.isLoading = false;
      }
    },

    processPeriodData() {
      const totalSeconds = this.periods.reduce((acc, period) => acc + period.total, 0);
      const totalHours = totalSeconds / 3600;

      this.setTotalBudgeted(totalHours);



      this.setUsedThisQuarter(0);

        // Sum the product of total and usage for each period
      const totalUsageSeconds = this.periods.reduce((acc, period) => {
        // Convert usage percentage to decimal and calculate
        const usageDecimal = period.usage / 100;
        return acc + (period.total * usageDecimal);
      }, 0);
      const totalUsageHours = totalUsageSeconds / 3600;

      this.setUsedThisPeriod(totalUsageHours);

      const totalRemainingHours = (totalHours - totalUsageHours);

      this.setRemainingHours(totalRemainingHours);

      this.setMaxHours(this.totalBudgeted + 10);
    },

    extractIssueIds() {
      return this.periods
        .flatMap(period => period.timeAllocations)
        .filter(allocation => allocation.against_Type === 'issue')
        .map(allocation => allocation.against_Id);
    },

    setTotalBudgeted(hours) {
      this.totalBudgeted = hours;
    },
    setUsedThisQuarter(hours) {
      this.usedThisQuarter = hours;
    },
    setUsedThisPeriod(hours) {
      this.usedThisPeriod = hours;
    },
    setRemainingHours(hours) {
      this.remainingHours = hours;
    },
    setMaxHours(hours) {
      const roundedHours = Math.round(hours / 5) * 5;
      this.maxHours = roundedHours;
    },
  },
  getters: {
    activePeriods: (state) => {
      return state.periods.filter(period => period.standing === 'active');
    },
    // Additional getters...
  }
});
