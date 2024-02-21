<template>
  <div class="flex pb-4 items-center bg-transparent">
    <!-- Dropdowns and Submit button -->
    <div class="px-4 w-3/5">
      <p>Dedicated Service Agreements</p>
      <select class="w-full shadow form-select appearance-none
                    block px-3 py-1.5 text-base font-normal
                    text-gray-700 bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300 rounded transition
                    ease-in-out m-0 focus:text-gray-700 focus:bg-white
                    focus:border-cyan-600 focus:outline-none"
                    v-model="selectedContract"
                    :disabled="!isAuthenticated"
                    :class="{'bg-gray-200': !isAuthenticated, 'bg-white': isAuthenticated}">
        <option disabled value="">Select Company</option>
        <option v-for="contract in contracts" :key="contract.company.id" :value="contract.id">
          {{ contract.company.name }}
        </option>
      </select>
    </div>

    <div class="px-5 w-1/5">
      <p>Report Frequency</p>
      <select class="w-full shadow form-select appearance-none
                    block px-3 py-1.5 text-base font-normal
                    text-gray-700 bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300 rounded transition
                    ease-in-out m-0 focus:text-gray-700 focus:bg-white
                    focus:border-cyan-600 focus:outline-none"
              v-model="selectedFrequency"
              :disabled="!isAuthenticated"
              :class="{'bg-gray-200': !isAuthenticated, 'bg-white': isAuthenticated}">
        <option disabled value="">Select Frequency</option>
        <option v-for="frequency in frequencies" :key="frequency.id" :value="frequency.id">
          {{ frequency.label }}
        </option>
      </select>
    </div>

    <div class="px-5 w-1/5">
      <p>Update Frequency</p>
      <button class="w-full shadow px-4 py-2 text-white rounded transition-colors"
              :class="{'bg-gray-500': isSubmitDisabled, 'bg-cyan-700 hover:bg-cyan-500': !isSubmitDisabled}"
              :disabled="isSubmitDisabled"
              @click="submit">
        SUBMIT
      </button>
    </div>
  </div>
</template>

<script>
import { useMyStore } from '../pinia/store';
import { useAuthStore } from '../pinia/authStore';
import { onMounted, computed, watch } from 'vue';
import axios from 'axios';

export default {
  created() {
  },
  computed: {
    contracts() {
      const myStore = useMyStore();
      return myStore.contracts;
    },
    frequencies() {
      const myStore = useMyStore();
      return myStore.frequencies;
    },
    selectedContract: {
      get() {
        const myStore = useMyStore();
        return myStore.selectedContract;
      },
      set(value) {
        const myStore = useMyStore();
        myStore.selectContract(value);
      }
    },
    selectedFrequency: {
      get() {
        const myStore = useMyStore();
        return myStore.selectedFrequency;
      },
      set(value) {
        const myStore = useMyStore();
        myStore.selectFrequency(value);
      } 
    }, 
    isSubmitDisabled() {
      const myStore = useMyStore();
      return !myStore.selectedFrequency;
    }
  },
  setup() {
    const authStore = useAuthStore();
    const myStore = useMyStore();
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const fetchContracts = async () => {
      if (authStore.isAuthenticated) {
        await myStore.fetchContracts();
      }
    };

    // Fetch contracts when the component is first mounted
    onMounted(fetchContracts);

    // Reactively fetch contracts when the authentication state changes
    watch(() => authStore.isAuthenticated, fetchContracts);
    watch(() => myStore.selectedContract, (newContractId) => {
      const selectedContract = myStore.contracts.find(contract => contract.id === newContractId);
      if (selectedContract) {
        myStore.selectFrequency(selectedContract.frequency); // Update the frequency in the store
      }
    }, { immediate: true });
    return {
      isAuthenticated,

    };
  },
  methods: {
    async submit() {
      const authStore = useAuthStore(); // Access the authentication store
      const myStore = useMyStore(); // Access the store with your selected data

      // Ensure there's a selected contract and frequency, and the user is authenticated
      if (!this.isSubmitDisabled && authStore.isAuthenticated && myStore.selectedContract && myStore.selectedFrequency) {
        try {
          // First, make a GET request to retrieve the current profile fields
          const getFieldResponse = await axios.get(`https://perbyte.api.accelo.com/api/v0/contracts/${myStore.selectedContract}/profiles/values`, {
            headers: {
              'Authorization': `Bearer ${authStore.token}`
            }
          });

          // Find the "Reporting Frequency" field in the response
          const frequencyField = getFieldResponse.data.response.find(field => field.field_name === "Reporting Frequency");

          if (!frequencyField) {
            throw new Error("Reporting Frequency field not found.");
          }

          // Now, make the PUT request to update the frequency
          const updateResponse = await axios.put(`https://perbyte.api.accelo.com/api/v0/contracts/${myStore.selectedContract}/profiles/values`, {
            field_values: [
              {
                id: frequencyField.id, // The dynamic ID of the "Reporting Frequency" field
                value: myStore.selectedFrequency // The new frequency value to be set
              }
            ]
          }, {
            headers: {
              'Authorization': `Bearer ${authStore.token}`
            }
          });

          console.log(updateResponse.data); // Handle the successful response
        } catch (error) {
          console.error("Error submitting frequency update:", error);
          // Handle the error, such as displaying a message to the user
        }
      }
    },
  },
};
</script>