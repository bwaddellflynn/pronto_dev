<template>
  <div class="data-container overflow-auto bg-white shadow rounded-lg">
    <div class="p-4">
      <!-- Table Header -->
      <div class="grid grid-cols-7 gap-4 font-bold py-2">
        <div class="col-span-1">ID# / Status</div>
        <div class="col-span-2">Request Name</div>
        <div class="col-span-3">Description</div>
        <div class="col-span-1">Hours</div>
      </div>
      <!-- Table Body -->
      <div class="divide-y divide-gray-200">
        <div v-for="ticket in tickets" :key="ticket.id" class="grid grid-cols-7 gap-4 py-2">
          <div class="col-span-1">{{ ticket.id }}<br>{{ ticket.standing }}</div>
          <div class="col-span-2">{{ ticket.class }}</div>
          <div class="col-span-3">{{ ticket.title }}</div>
          <div class="col-span-1">{{ convertToHours(ticket.billable_Seconds) }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center mb-8 mt-4">
      <div class="bg-white shadow-lg rounded-lg w-4/5"> 
        <textarea 
          v-model="note" 
          placeholder="Enter your notes here..." 
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          rows="4">
        </textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { useMyStore } from '../pinia/store';
import { useTicketStore } from '../pinia/ticketStore';
import { computed } from 'vue';

export default {
  name: 'TicketInformation',
  setup() {
    const myStore = useMyStore();
    const ticketStore = useTicketStore();

    const tickets = computed(() => ticketStore.tickets);

    const note = computed({
      get: () => myStore.reportNotes,
      set: (value) => myStore.setNote(value)
    });

    return { tickets, note };
  },
  methods: {
    // Converts seconds to hours with two decimal points
    convertToHours(seconds) {
      return (parseInt(seconds) / 3600).toFixed(2);
    }
  }
};
</script>
