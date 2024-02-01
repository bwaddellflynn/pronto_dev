<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div class="bg-white p-4 rounded shadow flex flex-col items-center">
        <p>{{ message }}</p>
        <button class="mt-4 py-2 px-4" @click="close">Close</button>
      </div>
    </div>
  </template>

  <script>
  export default {
    props: {
      show: Boolean,
      message: String,
    },
    methods: {
      close() {
        this.$emit('update:show', false);
      },
    },
  };
  </script>
  
  <style>
  </style>