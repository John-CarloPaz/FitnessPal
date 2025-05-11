<template>
    <v-app-bar flat class="border-b">
        <v-app-bar-title>{{ title }}</v-app-bar-title>
        <v-btn @click="signOut">Logout</v-btn>
    </v-app-bar>
</template>

<script>
import { ref, onMounted } from 'vue'; // used for conditional rendering
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
    name: 'AppBar',
    props: {
        title: {
            type: String,
            required: true,
        },
    },
    setup() {
        const router = useRouter();
        const isLoggedIn = ref(true);
        const auth = getAuth(); // Initialize Firebase Auth

        // Check authentication state
        onMounted(() => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    isLoggedIn.value = true; // User is logged in
                } else {
                    isLoggedIn.value = false; // User is not logged in
                }
            });
        });

        // Sign out function
        const signOut = () => {
            firebaseSignOut(auth)
                .then(() => {
                    router.push('/login'); // Redirect to login page
                })
                .catch((error) => {
                    console.error('Error signing out:', error);
                });
        };

        return {
            isLoggedIn,
            signOut,
        };
    },
};
</script>