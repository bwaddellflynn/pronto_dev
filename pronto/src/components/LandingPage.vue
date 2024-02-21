<template >
  <div>
    <div class="min-h-screen flex flex-col">
      <!-- Navbar -->
      <nav class="bg-gray-800 p-3 text-white flex justify-between items-center">
      <a href="#"><img class="object-scale-down h-7" alt="Vue logo" src="../assets/logo.png"></a>
        <div>
          <a href="#" class="mx-2 hover:text-gray-300 pr-4 pl-4">Home</a>
          <a href="#" class="mx-2 hover:text-gray-300 pr-4 pl-4">Help</a>
          <a v-if="!isAuthenticated" href="#" class="mx-2 hover:text-gray-300 pr-4 pl-4" @click="performLogin">Login</a>
          <a v-else href="#" class="mx-2 hover:text-gray-500" @click="performLogout">Logout</a>
          <ConfirmationDialogue :show="modals.logout" @confirm="performLogout" @update:show="updateModal('logout', $event)" />
        </div>
    </nav>


      <!-- Main content -->
      <div class="flex flex-grow bg-transparent">
        <!-- Sidebar -->
        <aside class="w-80 bg-gray-100 shadow-md">
          <div class="bg-white pb-9 pt-6 m-1 shadow rounded-lg">
            <img src="../assets/perbyte_logo.png" alt="User avatar" class="mx-auto rounded-full w-24 h-24 mb-2">
            <div class="text-center mt-5">
              <!-- TODO: Replace with values for username + email retrieved dynamically-->
              <p class="text-lg font-semibold">Jane Doe</p>
              <p><a href="#" class="mx-2 hover:text-gray-500">jane.doe@perbyte.com</a></p>
            </div>
          </div>
          <div class="shadow m-1">
            <button class="w-full pt-2 pb-2 font-semibold bg-gray-200 hover:text-white hover:bg-gray-400 rounded-t-lg" @click="openModal('generateReport')">Generate Report</button>
            <ModalComponent :show="modals.generateReport" @update:show="updateModal('generateReport', $event)">
              <p>The Generate Report feature is still under development.</p>
            </ModalComponent>
            <button class="w-full pt-2 pb-2 font-semibold bg-gray-200 hover:text-white hover:bg-gray-400 " @click="openModal('viewLastReport')">View Last Report</button>
            <ModalComponent :show="modals.viewLastReport" @update:show="updateModal('viewLastReport', $event)">
              <p>This View Last Report feature is still under development.</p>
            </ModalComponent>
            <button class="w-full pt-2 pb-2 font-semibold bg-gray-200 hover:text-white hover:bg-gray-400 " @click="sendReportByEmail">Send Report</button>
            <button class="w-full pt-2 pb-2 font-semibold bg-gray-200 hover:text-white hover:bg-gray-400  rounded-b-lg" @click="openModal('preferences')">Preferences</button>
            <ModalComponent :show="modals.preferences" @update:show="updateModal('preferences', $event)">
              <p>The Preferences feature is still under development.</p>
            </ModalComponent>
          </div>
          <ContactInformation :contact="selectedContactInfo"/>
        </aside>

        <!-- Data display area -->
        <main class="flex-grow px-4 py-2 bg-[url('../assets/work_area_background2.png')]">
          <CompanySelector />
          <ScrollableDataContainer />
          <hr class="border-t m-2 border-gray-400 shadow" />
          <div class="flex justify-center">
            <ChartDisplay/>
            <div class="pt-8">
              <CalendarSelector/>
            </div>
          </div>  
        </main>
      </div>

      <!-- Footer -->
      <footer class="bg-gray-200 p-4">
        <div class="container mx-auto text-center">
          <a href="#" class="mx-2 hover:text-gray-500" @click="openModal('tos')">Terms of Service</a>
          <ModalComponent :show="modals.tos" @update:show="updateModal('tos', $event)">
            <TermsOfService/>
          </ModalComponent>
          <a href="#" class="mx-2 hover:text-gray-500" @click="openModal('privacy')">Privacy Policy</a>
          <ModalComponent :show="modals.privacy" @update:show="updateModal('privacy', $event)">
            <p>This sytem was created by a junior developer <br>who lacks the knowledge and understanding to <br>perform complex and invasive data collection.<br>Your secrets are safe with us.<br></p>
          </ModalComponent>
          <a href="#" class="mx-2 hover:text-gray-500" @click="openModal('feedback')">Feedback</a>
          <ModalComponent :show="modals.feedback" @update:show="updateModal('feedback', $event)">
            <!-- Content for Feedback -->
          </ModalComponent>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import CompanySelector from './CompanySelector.vue'
import ContactInformation from './ContactInformation.vue'
import ScrollableDataContainer from './ScrollableDataContainer.vue';
import ChartDisplay from './ChartDisplay.vue';
import CalendarSelector from './CalendarSelector.vue';
import ModalComponent from './ModalComponent.vue';
import ConfirmationDialogue from './ConfirmationDialogue.vue';
import TermsOfService from './TermsOfService.vue';
import { computed } from 'vue';
import { useAuthStore } from '../pinia/authStore';
import { useMyStore } from '../pinia/store';
import axios from 'axios';


export default {
  name: 'HelloWorld',
  components: {
    CompanySelector,
    ScrollableDataContainer,
    ChartDisplay,
    CalendarSelector,
    ModalComponent,
    ConfirmationDialogue,
    TermsOfService,
    ContactInformation
},
  setup() {
    const authStore = useAuthStore();
    const performLogin = async () => {
      //authStore.login();
      try {
        const response = await axios.get('https://localhost:7250/TestAuth/login');
        authStore.setToken(response.data.token);
        console.log('Is Authenticated: ', authStore.isAuthenticated);
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

    const performLogout = () => {
      authStore.logout();
      console.log('Is Authenticated: ', authStore.isAuthenticated);
    };

    const isAuthenticated = computed(() => authStore.isAuthenticated); 
    return {
      isAuthenticated,
      performLogin,
      performLogout,
    };
  },
  data() {
    return {
      modals: {
        generateReport: false,
        viewLastReport: false,
        preferences: false,
        tos: false,
        privacy: false,
        feedback: false,
        logout: false,
      },
      showModal: true,
    };
  },
  computed: {
    myStore() {
      return useMyStore();
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
      return this.myStore.selectedContractName;
    },
  },
  mounted() {
    const authStore = useAuthStore();
    authStore.checkAuthStatus();
  },
  methods: {
    openModal(type) {
      this.modals[type] = true;
    },
    updateModal(type, value) {
      this.modals[type] = value;
    },
    openLogoutDialog() {
      this.modals.logout = true;
    },
    sendReportByEmail() {
    const myStore = useMyStore();
    const email = 'Client Email';
    const subject = encodeURIComponent('DSA Report Update for ' + myStore.formattedStartDate + " to " + myStore.formattedStartDate);
    const body = encodeURIComponent('Attached you will find your regularly scheduled updates for your dedicated service agreement with PerByte.');

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink; 
    },
  },
}
</script>
