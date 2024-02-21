<template>
  <div class="p-4">
    <!-- Display selected date range -->
    <div class="flex" v-if="dateRange.start && dateRange.end">
      <p>Start: {{ dateRange.start.toLocaleDateString() }}-</p>
      <p>End: {{ dateRange.end.toLocaleDateString() }}</p>
    </div>

    <DatePicker
      is-range
      v-model="dateRange"
      mode="range"
      :attributes="attrs"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useMyStore } from '../pinia/store';
import 'v-calendar/dist/style.css';
import { DatePicker } from 'v-calendar';

export default {
  components: {
    DatePicker,
  },
  setup() {
  const myStore = useMyStore();
  const dateRange = ref({ start: null, end: null });
  const attrs = ref(myStore.attrs);

  const updateStoreDateRange = (start, end) => {
      dateRange.value.start = start;
      dateRange.value.end = end;
      myStore.updateStartDate(start);
      myStore.updateEndDate(end);
    };
    watch(dateRange, (newValue) => {
      if (newValue.start) {
        const selectedDate = new Date(newValue.start);
        let start = new Date(); // Default to today
        let end;

        switch (myStore.selectedFrequency) {
          case 'On-Demand': {
            start = new Date(selectedDate);
            end = new Date(newValue.end);
            updateStoreDateRange(start, end);
            break;
          }
          case 'Bi-Weekly': {
            const adjustment = selectedDate.getDay() === 0 ? -6 : 1;
            start = new Date(selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay() + adjustment));
            end = new Date(new Date(start).setDate(start.getDate() + 13));
            updateStoreDateRange(start, end);
            break;
          }
          case 'Monthly': {
            start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
            updateStoreDateRange(start, end);
            break;
          }
          case 'Quarterly': {
            start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 3, 0);
            updateStoreDateRange(start, end);
            break;
          }
          case 'Yearly': {
            start = new Date(selectedDate.getFullYear(), 0, 1);
            end = new Date(selectedDate.getFullYear() + 1, 0, 0);
            updateStoreDateRange(start, end);
            break;
          }
          case 'Fortnightly': {
            start = new Date(selectedDate.getFullYear(), 0, 1);
            end = new Date(selectedDate.getFullYear() + 1, 0, 0);
            updateStoreDateRange(start, end);
            break;
          }
          default: {
            start = new Date(selectedDate);
            end = new Date(newValue.start);
            updateStoreDateRange(start, end);
          }
        }

        // Update the dateRange with the new values
        dateRange.value.start = start;
        dateRange.value.end = end;
        if (newValue.start && newValue.end) {
          // Define the highlight attribute for the selected date range
          const highlightAttribute = {
            key: 'selectedRange',
            highlight: {
              start: { fillMode: 'solid', color: 'gray' },
              base: { fillMode: 'light', color: 'gray' },
              end: { fillMode: 'solid', color: 'gray' },
            },
            dates: { start: newValue.start, end: newValue.end },
          };

          // Update the attributes array with the new highlight attribute
          attrs.value = [highlightAttribute];
        } else {
          // Clear attributes if no date range is selected
          attrs.value = [];
        }
      }
    });

    return {
      dateRange,
      attrs,
    };
  },
};
</script>

<style scoped>
</style>