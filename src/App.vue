<template>
  <v-app>
    <Navigation v-if="isAuthenticated"/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue';
import Navigation from './components/Navigation.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
export default {
  name: 'App',
  components: {
    Navigation,
  },
  setup() {
    const isAuthenticated = ref(false); // Reactive property to track authentication state
    const auth = getAuth(); // Initialize Firebase Auth

    // Check authentication state on app load
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user; // Set to true if user exists, false otherwise
      });
    });

    return {
      isAuthenticated,
    };
  },
};
</script>