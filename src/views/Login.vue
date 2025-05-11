<template>
    <v-row class="fill-height ma-0">
        <v-col cols="12" lg="4" class="w-100 d-flex flex-column align-center justify-center">
            <v-container fluid class="d-flex flex-column align-center justify-center w-75">
                <div class="pa-5">
                    <v-avatar :image="logo" class="mb-5" size="100"></v-avatar>
                    <p class="text-h4 font-weight-bold px-0 mb-2">Welcome Back to FitnessPal!</p>
                    <p class="text-subtitle-1 px-0 text-grey-darken-2 mb-3">Don't have an account? <router-link to="/register">Register</router-link></p>                  
                    <v-text-field v-model="email" label="Email" variant="outlined"></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password" variant="outlined"></v-text-field>
                    <p v-show="errMsg" class="text-red">{{ errMsg }}</p>
                    <v-btn block @click="signIn" color="primary" class="ml-auto px-0" variant="flat" size="large">Submit</v-btn>
                </div>
            </v-container>
        </v-col>
        <v-col cols="12" lg="8" class="h-100 w-100 pa-0">
            <v-img 
                :src="loginImage" 
                class="d-flex  align-center justify-center rounded-l-lg" 
                cover 
                height="100vh">
            </v-img>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { useRouter } from 'vue-router'
import loginImage from '../assets/login-photo.jpg'
import logo from '../assets/logo.png'

const email = ref('')
const password = ref('')
const router = useRouter()
const errMsg = ref('')

const auth = getAuth() // Initialize Firebase Auth

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('User is already logged in:', user.email)
            console.log('USER UID', user.uid)
            router.push('/log') // Redirect to the feed if logged in
        }
    })
})

const signIn = () => {
    // Set persistence to local to keep the user logged in
    setPersistence(auth, browserLocalPersistence)
        .then(() => {
            return signInWithEmailAndPassword(auth, email.value, password.value)
        })
        .then((userCredential) => {
            const user = userCredential.user
            console.log('USER UID', user.uid)
            console.log('Successfully logged in!')
            router.push('/log') // Redirect to the feed
        })
        .catch(error => {
        switch (error.code) {
          case 'auth/invalid-email':
              errMsg.value = 'Invalid email'
              break
          case 'auth/user-not-found':
              errMsg.value = 'No account with that email was found'
              break
          case 'auth/wrong-password':
              errMsg.value = 'Incorrect password'
              break
          default:
              errMsg.value = 'Email or password was incorrect'
              break
        }
      });
}
</script>

