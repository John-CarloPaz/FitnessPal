<template>
    <AppBar title="Calculator" />
        <v-row class="d-flex justify-center align-center h-100" no-gutters>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Calorie Calculator</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="weight" label="Weight (kg)" type="number" />
                        <v-text-field v-model="height" label="Height (cm)" type="number" />
                        <v-text-field v-model="age" label="Age (years)" type="number" />
                        <v-select 
                            :items="items" 
                            item-title="title" 
                            label="Activity Level" 
                            item-value="value" 
                            v-model="activityLevel">
                            <template v-slot:item="{ props: itemProps, item }">
                                <v-list-item v-bind="itemProps" :subtitle="item.subtitle"></v-list-item>
                            </template>
                        </v-select>
                        <v-select 
                            :items="['Male', 'Female']" 
                            label="Gender" 
                            v-model="gender" />
                        <v-btn @click="calculateTDEE">Calculate</v-btn>
                        <p v-if="tdee">Your TDEE is: {{ tdee }} kcal/day</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref as dbRef, set, get } from 'firebase/database';
import AppBar from '@/components/AppBar.vue';

// Reactive properties
const weight = ref<number | null>(null);
const height = ref<number | null>(null);
const age = ref<number | null>(null);
const gender = ref<string | null>(null);
const activityLevel = ref<number | null>(null);
const tdee = ref<number | null>(null);

// Activity level options
const items = [
    { title: 'Sedentary', value: 1.2, subtitle: 'Little or no exercise' },
    { title: 'Lightly Active', value: 1.375, subtitle: 'Light exercise/sports 1-3 days/week' },
    { title: 'Moderately Active', value: 1.55, subtitle: 'Moderate exercise/sports 3-5 days/week' },
    { title: 'Very Active', value: 1.725, subtitle: 'Hard exercise/sports 6-7 days a week' },
    { title: 'Super Active', value: 1.9, subtitle: 'Very hard exercise/sports & physical job or training twice a day' },
];

// Fetch existing TDEE data on component mount
onMounted(async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.log('User is not logged in.');
        return;
    }

    const userID = user.uid; // Get the user's UID
    const db = getDatabase(); // Initialize Firebase Realtime Database
    const dbPath = `/user/${userID}/tdee/`; // Path in the database

    try {
        const tdeeRef = dbRef(db, dbPath);
        const snapshot = await get(tdeeRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('Existing TDEE data:', data);

            // Populate the reactive properties with the fetched data
            weight.value = data.weight;
            height.value = data.height;
            age.value = data.age;
            gender.value = data.gender;
            activityLevel.value = data.activityLevel;
        } else {
            console.log('No existing TDEE data found.');
        }
    } catch (error) {
        console.error('Error fetching TDEE data:', error);
    }
});

// Method to calculate TDEE and save to Firebase
const calculateTDEE = async () => {
    if (!weight.value || !height.value || !age.value || !gender.value || !activityLevel.value) {
        alert('Please fill in all fields.');
        return;
    }

    let bmr;
    if (gender.value === 'Male') {
        bmr = (10 * weight.value) + (6.25 * height.value) - (5 * age.value) + 5;
    } else {
        bmr = (10 * weight.value) + (6.25 * height.value) - (5 * age.value) - 161;
    }

    tdee.value = Math.round(bmr * activityLevel.value); // Calculate TDEE and round to nearest integer

    // Save TDEE to Firebase
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        alert('You must be logged in to save your TDEE.');
        return;
    }

    const userID = user.uid; // Get the user's UID
    const db = getDatabase(); // Initialize Firebase Realtime Database
    const dbPath = `/user/${userID}/tdee/`; // Path in the database

    try {
        await set(dbRef(db, dbPath), {
            tdee: tdee.value,
            weight: Number(weight.value), // Ensure values are stored as numbers
            height: Number(height.value),
            age: Number(age.value),
            gender: gender.value,
            activityLevel: activityLevel.value,
        });
        alert('TDEE saved successfully!');
    } catch (error) {
        console.error('Error saving TDEE:', error);
        alert('Failed to save TDEE. Please try again.');
    }
};
</script>