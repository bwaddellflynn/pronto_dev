<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div class="bg-white p-4 rounded shadow">
        <slot></slot> <!-- Content goes here -->
        <button @click="close">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['show'],
    emits: ['update:show'],
    methods: {
      close() {
        this.$emit('update:show', false); // Close modal
      },
    },
  };
  </script>
  