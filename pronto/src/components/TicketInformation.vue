<template>
  <div class="data-container overflow-auto bg-white shadow rounded-lg">
    <div class="p-4">
      <!-- Table Header -->
      <div class="grid grid-cols-7 gap-4 font-bold py-2">
        <div class="col-span-1">Ticket Number</div>
        <div class="col-span-2">Title</div>
        <div class="col-span-3">Description</div>
        <div class="col-span-1">Hours</div>
      </div>
      <!-- Table Body -->
      <div class="divide-y divide-gray-200">
        <div v-for="ticket in tickets" :key="ticket.id" class="grid grid-cols-7 gap-4 py-2">
          <div class="col-span-1">{{ ticket.number }} <br>In Progress</div>
          <div class="col-span-2">{{ ticket.title }}</div>
          <div class="col-span-3">{{ ticket.description }}</div>
          <div class="col-span-1">{{ ticket.hours }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center mb-8 mt-4">
      <div class=" bg-white shadow-lg rounded-lg w-4/5"> 
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
import { computed } from 'vue';
import { faker } from '@faker-js/faker';

export default {
  name: 'TicketInformation',
  setup() {
    const myStore = useMyStore();

    const note = computed({
      get: () => myStore.reportNotes,
      set: (value) => myStore.setNote(value)
    });
    return { note };
  },
  data() {
    return { 
      tickets: this.generateTickets(8) // Generate (X) IT ticket objects
    };
  },
  methods: {
    // Placeholder data generated with Faker
    generateTickets(count) {
      const tickets = [];
      for (let i = 0; i < count; i++) {
        tickets.push({
          id: i,
          number: faker.string.alphanumeric({ length: 5, casing: 'upper' }),
          description: faker.hacker.phrase(),
          title: faker.git.commitMessage(),
          hours: faker.number.int(30)
        });
      }
      return tickets;
    }
  }
};
</script>