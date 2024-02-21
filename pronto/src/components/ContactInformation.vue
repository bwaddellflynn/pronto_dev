<template>
    <div class="bg-white p-4 m-1 shadow rounded-lg">
      <div class="mb-2 font-bold">Contact Person</div>
      <div v-if="affiliationContact">
        <p class="pt-2"><strong>Name:</strong> {{ affiliationContact.firstname }} {{ affiliationContact.surname }}</p>
        <p class="pt-2"><strong>Email:</strong> {{ affiliationContact.email }}</p>
        <p class="pt-2"><strong>Phone:</strong> {{ affiliationContact.mobile || affiliationContact.phone }}</p>
        <!-- Add more fields as necessary -->
      </div>
      <div v-else>
        <p>Select a company to view contact information.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useMyStore } from '../pinia/store';
  
  const store = useMyStore();
  
  const affiliationContact = computed(() => {
    const selectedContract = store.contracts.find(contract => contract.id === store.selectedContract);
    if (selectedContract && selectedContract.affiliation && selectedContract.affiliation.contact) {
      const contact = selectedContract.affiliation.contact;
      return {
        firstname: contact.firstname || 'N/A', // Replace 'N/A' with any default text you prefer
        surname: contact.surname || 'N/A',
        email: contact.email || 'N/A',
        phone: contact.phone || 'N/A',
        mobile: contact.mobile || 'N/A',
      };
    }
    return null;
  });
  </script>
  