<template>
    <ModalComponent :show="show" @update:show="updateShow">
      <p>Are you sure you want to logout?</p>
      <button @click="confirmLogout">Confirm</button>
      <button @click="cancel">Cancel</button>
    </ModalComponent>
  </template>
  
  <script>
  import ModalComponent from './ModalComponent.vue';
  
  export default {
    components: {
      ModalComponent,
    },
    props: ['show'],
    emits: ['confirm', 'update:show'],
    methods: {
      confirmLogout() {
        this.$emit('confirm');
        this.updateShow(false);
      },
      cancel() {
        this.updateShow(false);
      },
      updateShow(value) {
        this.$emit('update:show', value);
      },
    },
  };
  </script>
  