<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="register">Submit</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')

const register = () => {
    const auth = getAuth() // Initialize Firebase Auth
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            console.log('Successfully registered!')
            router.push('/log') // Redirect to the feed
        })
        .catch((error) => {
            console.log(error.code)
            alert(error.message)
        })
}
</script>