<template>
    <v-navigation-drawer app v-model="drawer" :rail="rail" permanent @click="rail = false" width="300">
        <v-list-item :prepend-avatar="logo" class="ml-1 mb-2"nav>
            <p class="text-h6 text-blue-darken-4 font-weight-black">FITNESSPAL</p>
            <template v-slot:append>
                <v-btn icon variant="text" @click.stop="rail = !rail">
                    <v-avatar rounded="circle" icon="fa-chevron-left" class="fa-xs"></v-avatar>
                </v-btn>
            </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" class="ml-1 my-2" nav>
            <template v-slot:title>
                <div id="user-info">
                    <p class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-0">John Carlo Paz</p>
                    <p class="text-subtitle-2 text-grey-darken-2 mt-0">jpaz@spcf.edu.ph</p>
                </div>

            </template>
        </v-list-item>
        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item v-for="(navigation, index) in navigations" :key="index" :prepend-icon="navigation.icon" :value="navigation.title" :to="navigation.to">
                <template v-slot:title>
                    <p class="text-subtitle-1 text-grey-darken-2 font-weight-bold mb-0">{{ navigation.title }}</p>
                </template>
            </v-list-item>

        </v-list>
    </v-navigation-drawer>
</template>

<script>
import logo from '../assets/logo.png'
import { ref } from 'vue'
const drawer = ref(true)
const rail = ref(true)

export default {
    name: 'Navigation',
    data() {
        return {
            logo,
            navigations: [
                { icon: 'fa-house', title: 'Home', to: '/home' },
                { icon: 'fa-utensils', title: 'Log Food', to: '/log' },
                { icon: 'fa-calculator', title: 'TDEE Calculator', to: '/calculator' },
            ],
        }
    },
    setup() {
        return { drawer, rail }
    },
}
</script>

<style>
    #user-info p {
        line-height: 1.2;
    }
    p, h1, h2, h3, h4, h5, h6 {
        cursor: default;
        user-select: none;
    }
</style>