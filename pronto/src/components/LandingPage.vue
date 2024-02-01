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
        <aside class="w-80 bg-gray-100 pt-6 shadow-md">
          <div class="mb-9 mt-5">
            <img src="../assets/perbyte_logo.png" alt="User avatar" class="mx-auto rounded-full w-24 h-24 mb-2">
            <div class="text-center mt-5">
              <!-- TODO: Replace with values for username + email retrieved dynamically-->
              <p class="text-lg font-semibold">Jane Doe</p>
              <p><a href="#" class="mx-2 hover:text-gray-500">jane.doe@perbyte.com</a></p>
            </div>
          </div>

          <button class="w-full pt-2 pb-2 bg-gray-200 hover:bg-gray-300">Generate Report</button>
          <button class="w-full pt-2 pb-2 bg-gray-200 hover:bg-gray-300">View Last Report</button>
          <button class="w-full pt-2 pb-2 bg-gray-200 hover:bg-gray-300">Send Report</button>
          <button class="w-full pt-2 pb-2 bg-gray-200 hover:bg-gray-300">Preferences</button>
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
            This sytem was created by a junior developer <br>who lacks the knowledge and understanding to <br>perform complex and invasive data collection.<br>Your secrets are safe with us.<br>
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
import ScrollableDataContainer from './ScrollableDataContainer.vue';
import ChartDisplay from './ChartDisplay.vue';
import CalendarSelector from './CalendarSelector.vue';
import ModalComponent from './ModalComponent.vue';
import ConfirmationDialogue from './ConfirmationDialogue.vue';
import TermsOfService from './TermsOfService.vue';
import { computed } from 'vue';
import { useAuthStore } from '../pinia/authStore';
//import axios from 'axios';


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
  },
  setup() {
    const authStore = useAuthStore();
    const performLogin = () => {
      authStore.login();
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
        tos: false,
        privacy: false,
        feedback: false,
        logout: false,
      },
      showModal: true,
    };
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
  },
}
</script>
