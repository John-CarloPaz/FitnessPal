<template>
    <AppBar title="Dashboard" />
    <v-row class="pa-10">
        <v-col cols="12" md="3">
            <v-card class="pt-3 px-8 pb-8" outlined>
                <v-card-title class="text-h6 pa-0 ma-0">Calories</v-card-title>
                <v-card-subtitle class="text-subtitle-1 pa-0 ma-0 mb-3">Remaining = Goal - Food</v-card-subtitle>
                <v-container class="ma-0 pa-0 w-full d-flex justify-center align-center">
                    <v-progress-circular
                        :model-value="progressPercentage"
                        rotate="-90"
                        size="180"
                        width="15"
                        color="primary"
                    >
                        {{ caloriesConsumed }} / {{ tdee }} kcal
                    </v-progress-circular>
                </v-container>
            </v-card>
        </v-col>
        <v-col cols="12" md="3" v-for="(item, index) in nutrientArray" :key="index" class="d-flex align-center h-full">
            <v-card class="pt-3 px-8 pb-8 w-100 h-100">
                <v-avatar :image="item.icon" size="60" class="ma-0 pa-0"></v-avatar>
                <v-container class="ma-0 pa-0 w-full h-100 d-flex flex-column justify-center align-start">
                    <v-card-title class="text-h6 pa-0 ma-0">{{ item.nutrient }}</v-card-title>
                    <v-card-subtitle class="text-subtitle-1 pa-0 ma-0 mb-3">Total: {{ item.value }} g</v-card-subtitle>
                    <v-card-subtitle class="text-subtitle-1 text-wrap pa-0 ma-0 mb-3">{{item.fact}}</v-card-subtitle>
                    <v-progress-linear
                        :model-value="(item.value / 140) * 100"
                        height="5"
                        color="primary"
                        class=""
                    ></v-progress-linear>
                </v-container>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref as dbRef, get } from 'firebase/database';
import AppBar from '@/components/AppBar.vue';
import protein from '../assets/protein.png'
import totalFat from '../assets/total_fat_g.png'
import carbohydrates from '../assets/carbs.png'


// Reactive properties
const tdee = ref<number | null>(null);
const caloriesConsumed = ref<number>(0);
const progressPercentage = ref<number>(0);
const totalNutrients = ref({
    carbohydrates_total_g: 0,
    protein_g: 0,
    fat_total_g: 0,
});

const nutrientIcons = {
    carbohydrates_total_g: carbohydrates,
    protein_g: protein,
    fat_total_g: totalFat,
};

const nutrientFacts = {
    protein_g: "Protein helps build, repair, and maintain the body's tissues, including muscles, organs, skin, and enzymes.",
    carbohydrates_total_g: "Carbohydrates are the body's primary source of energy, providing fuel for physical activity and brain function.",
    fat_total_g: "Fats are essential for hormone production, nutrient absorption, and providing energy. They also help protect organs.",
}

const nutrientArray = computed(() =>
    Object.entries(totalNutrients.value).map(([key, value]) => {
        const nutrientNames: Record<string, string> = {
            carbohydrates_total_g: 'Carbohydrates',
            protein_g: 'Protein',
            fat_total_g: 'Fat',
        };

        return {
            nutrient: nutrientNames[key] || null,
            value,
            icon: nutrientIcons[key] || null,
            fact: nutrientFacts[key] || null,
        };
    })
);

// Fetch TDEE and food logs on component mount
onMounted(async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.log('User is not logged in.');
        return;
    }

    const userID = user.uid; // Get the user's UID
    const db = getDatabase(); // Initialize Firebase Realtime Database
    const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });

    try {
        // Fetch TDEE
        const tdeePath = `/user/${userID}/tdee/`;
        const tdeeRef = dbRef(db, tdeePath);
        const tdeeSnapshot = await get(tdeeRef);

        if (tdeeSnapshot.exists()) {
            tdee.value = tdeeSnapshot.val().tdee;
        } else {
            console.log('No TDEE data found.');
        }

        // Fetch food logs
        const foodLogsPath = `/user/${userID}/food_logs/${currentDate}/`;
        const foodLogsRef = dbRef(db, foodLogsPath);
        const foodLogsSnapshot = await get(foodLogsRef);

        if (foodLogsSnapshot.exists()) {
            const foodLogs = foodLogsSnapshot.val();

            // Calculate total calories and nutrients
            foodLogs.forEach((item: any) => {
                caloriesConsumed.value += Math.round(item.calories); // Round calories to the nearest integer
                totalNutrients.value.carbohydrates_total_g += item.carbohydrates_total_g;
                totalNutrients.value.protein_g += item.protein_g;
                totalNutrients.value.fat_total_g += item.fat_total_g;
            });

            // Calculate progress percentage
            if (tdee.value) {
                progressPercentage.value = Math.min((caloriesConsumed.value / tdee.value) * 100, 100);
            }
        } else {
            console.log('No food logs found for the current date.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
</script>