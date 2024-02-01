<template>
  <div class="relative">
    <div class="data-container max-h-96 overflow-auto bg-white shadow rounded-lg">
      <TicketInformation />
    </div>
    <!-- Button to open modal -->
    <div class="flex justify-center pt-2">
      <button @click="isModalOpen = true" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-cyan-500">
        View Report Preview
      </button>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white p-6 overflow-auto rounded shadow-lg-h-screen w-letter h-full">
        <h3 class="text-lg font-bold mb-4">Report Preview</h3>
        <div id="contentToCapture" ref="contentToCapture" class="bg-white">  
          <!-- Modal content -->
          <!-- Modal Header -->
          <div class="px-7 py-3 flex justify-center">
            <div class="border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-700">Status Report for: {{ selectedCompanyLabel }}</h2>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-7">
            <p class="text-md font-medium text-gray-600 mb-2">{{ selectedFrequencyLabel }} reports are generated for your convenience.</p>
            <p class="text-md font-medium text-gray-600 mb-2">Report for the period of: {{ formattedStartDate }} to {{ formattedEndDate }}</p>
            <!-- Ticket Information Component -->
            <div class="mb-4">
              <TicketInformation />
            </div>
            <!-- Chart Display Component -->
            <ChartDisplay />
          </div>
        </div>
        <!-- Close button -->
        <div class="flex justify-center pt-2">
          <button @click="closeModal" class="mx-2 mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
            Close Preview
          </button>
          <button @click="captureAndDownloadImage" class="mx-2 mt-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-700">Download Report</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';
import TicketInformation from './TicketInformation.vue';
import ChartDisplay from './ChartDisplay.vue';
import { useMyStore } from '../pinia/store';

export default {
  name: 'ScrollableDataContainer',
  components: {
    TicketInformation,
    ChartDisplay, 
  },
  setup() {
    const notesStore = useMyStore();
    return { notesStore };
  },
  data() {
    return {
      isModalOpen: false,
    };
  },
  computed: {
    myStore() {
      return useMyStore();
    },
    selectedFrequency() {
      return this.myStore.selectedFrequency;
    },
    selectedCompany() {
      return this.myStore.selectedContract;
    },
    startDate() {
      return this.myStore.startDate;
    },
    endDate() {
      return this.myStore.endDate;
    },
    formattedStartDate() {
      return this.myStore.formattedStartDate;
    },
    formattedEndDate() {
      return this.myStore.formattedEndDate;
    },
    selectedFrequencyLabel() {
      return this.myStore.selectedFrequencyLabel;
    },
    selectedCompanyLabel() {
      return this.myStore.selectedCompanyName;
    },
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
      
    },
    closeModal() {
      this.isModalOpen = false;
    },
    captureAndDownloadImage() {
      const node = this.$refs.contentToCapture;
      const filename = this.generateFileName();

      domtoimage.toPng(node)
        .then((dataUrl) => {
          // Create a new jsPDF instance
          const pdf = new jsPDF();

          // Calculate the width and height to maintain aspect ratio and add margin to top
          const imgWidth = 210; // A4 width in mm
          const imgHeight = node.offsetHeight * imgWidth / node.offsetWidth;
          const topMargin = 5;

          // Add the image to the PDF
          pdf.addImage(dataUrl, 'PNG', 0, topMargin, imgWidth, imgHeight);

          // Save the PDF
          pdf.save(filename);
        })
        .catch((error) => {
          console.error('Error generating PDF:', error);
        });
    },
    generateFileName() {
      const currentDate = new Date();
      const timestamp = currentDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const filename = `${timestamp}_${this.selectedCompanyLabel}_${this.formattedStartDate}_to_${this.formattedEndDate}.pdf`;
      return filename.replace(/\s+/g, '_');
    },
  },
};
</script>
