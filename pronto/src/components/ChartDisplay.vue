<template>
  <div class="flex justify-center items-center mt-9 pr-10">
    <div class="chart-container">
      <canvas ref="chartCanvas" ></canvas>
    </div>
  </div>
</template>


<script>
import { Chart, registerables } from 'chart.js';
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { usePeriodStore } from '../pinia/periodStore';
import { useMyStore } from '../pinia/store';

Chart.register(...registerables);

export default {
  setup() {
    const chartCanvas = ref(null);
    let myChart = null;
    const myStore = useMyStore();
    const periodStore = usePeriodStore();

    const periods = computed(() => periodStore.periods);

    watch(
      [() => myStore.selectedContract, () => myStore.UTCStartDate, () => myStore.UTCEndDate],
      async ([newContractId, newStartDate, newEndDate]) => {
        if (newContractId && newStartDate && newEndDate) {
          await periodStore.fetchPeriods(newContractId, newStartDate, newEndDate);
        }
      },
      { immediate: true }
    );

    // Chart data and options
    const chartData = {
      labels: ['Total Budgeted', 'Used this Quarter', 'Used this Period', 'Hours Remaining'],
      datasets: [
        {
          label: 'Hours',
          data: [0, 0, 0, 0], // Initial data set to 0
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      type: 'bar',
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          max: () => periodStore.maxHours,
        },
        y: {
          barThickness: 24,
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
      maintainAspectRatio: false,
    };

    // Update chart data function
    const updateChartData = () => {
      myChart.data.datasets[0].data = [
        periodStore.totalBudgeted, 
        periodStore.usedThisQuarter, 
        periodStore.usedThisPeriod, 
        periodStore.remainingHours
      ];
      myChart.update();
    };

    // Watch for changes in the periodStore
    watch(
      () => [
        periodStore.totalBudgeted, 
        periodStore.usedThisQuarter, 
        periodStore.usedThisPeriod, 
        periodStore.remainingHours,
        periodStore.maxHours
      ],
      () => {
        if (myChart) {
          updateChartData();
        }
      },
      { immediate: true }
    );

    // Initialize the chart
    onMounted(() => {
      myChart = new Chart(chartCanvas.value.getContext('2d'), {
        type: chartOptions.type,
        data: chartData,
        options: chartOptions,
      });
    });

    // Clean up on component unmount
    onBeforeUnmount(() => {
      if (myChart) {
        myChart.destroy();
      }
    });
    return {
      chartCanvas,
      periods,
    };
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 30vh;
  width: 50vw;
}
</style>
