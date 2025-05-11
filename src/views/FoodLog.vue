<template>
    <AppBar title="Log Food"/>
    <v-row class="px-10 pt-10">
        <v-col cols="12" class="d-flex align-center">
            <v-text-field label="Label" variant="outlined" :append-icon="appendIcon" @click:append="handleAppendClick" v-model="foodSearch"></v-text-field>
        </v-col>
        <v-col cols="12">
            <p class="text-h5">Total Nutrients</p>
        </v-col>
        <v-col cols="12" md="3" v-for="(item, index) in totalNutrients" :key="index" class="d-flex align-center">
            <v-card class="mx-auto px-0 w-100" :prepend-avatar="item.icon">
                <template v-slot:title>
                    <p>{{ item.value }}</p>
                </template>
                <template v-slot:subtitle>
                    <p class="text-capitalize">{{ item.nutrient }}</p>
                </template>
            </v-card>
        </v-col>
        <v-col cols="12"  v-if="foodData.length > 0" class="mt-6">
            <p class="text-h5">Nutrients Table</p>
        </v-col>
        <v-col cols="12" v-if="foodData.length > 0" class="mt-5">
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">Food</th>
                        <th class="text-left">Calories</th>
                        <th class="text-left">Protein</th>
                        <th class="text-left">Carbohydrates</th>
                        <th class="text-left">Fat</th>
                        <th class="text-left">Fiber</th>
                        <th class="text-left">Potassium</th>
                        <th class="text-left">Sugar</th>
                        <th class="text-left">Sodium</th>
                        <th class="text-left">Saturated Fat</th>
                        <th class="text-left">Cholesterol</th>
                        <th class="text-left">Serving Size</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in foodData" :key="index">
                        <td>{{ item.name }}</td>
                        <td>{{ item.calories }}</td>
                        <td>{{ item.protein_g }}</td>
                        <td>{{ item.carbohydrates_total_g }}</td>
                        <td>{{ item.fat_total_g }}</td>
                        <td>{{ item.fiber_g }}</td>
                        <td>{{ item.potassium_mg }}</td>
                        <td>{{ item.sugar_g }}</td>
                        <td>{{ item.sodium_mg }}</td>
                        <td>{{ item.fat_saturated_g }}</td>
                        <td>{{ item.cholesterol_mg }}</td>
                        <td>{{ item.serving_size_g }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>
    </v-row>
    
</template>

<script>
import AppBar from '../components/AppBar.vue'
import calories from '../assets/calories.png'
import protein from '../assets/protein.png'
import saturatedFat from '../assets/saturated_fat.png'
import totalFat from '../assets/total_fat_g.png'
import carbohydrates from '../assets/carbs.png'
import sugar from '../assets/sugar.png'
import fiber from '../assets/fiber.png'
import servingSize from '../assets/total_grams.png'
import sodium from '../assets/sodium.png'
import potassium from '../assets/potassium.png'
import cholesterol from '../assets/cholesterol.png'
import { getDatabase, ref as dbRef, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
export default {
    components: {
        AppBar,
    },

    name: 'FoodLog',
    data() {
        return {
            calories,
            protein,
            saturatedFat,
            totalFat,
            carbohydrates,
            sugar,
            fiber,
            servingSize,
            sodium,
            potassium,
            cholesterol,
            foodSearch: '',
            foodData: [],
            appendIcon: 'fa-magnifying-glass',
        }
    },
    watch: {
        foodSearch(newValue) {
            // Reset the icon to magnifying glass when foodSearch changes
            this.appendIcon = 'fa-magnifying-glass';

            // Optionally clear foodData if foodSearch is empty
            if (!newValue) {
                this.foodData = [];
            }
        },
    },
    computed: {
        totalNutrients() {
            // Calculate the total nutrients
            const totals = this.foodData.reduce(
                (totals, item) => {
                    totals.calories += item.calories || 0;
                    totals.protein_g += item.protein_g || 0;
                    totals.fat_total_g += item.fat_total_g || 0;
                    totals.carbohydrates_total_g += item.carbohydrates_total_g || 0;
                    totals.fat_saturated_g += item.fat_saturated_g || 0;
                    totals.sugar_g += item.sugar_g || 0;
                    totals.fiber_g += item.fiber_g || 0;
                    totals.serving_size_g += item.serving_size_g || 0;
                    totals.sodium_mg += item.sodium_mg || 0;
                    totals.potassium_mg += item.potassium_mg || 0;
                    totals.cholesterol_mg += item.cholesterol_mg || 0;
                    return totals;
                },
                {
                    calories: 0,                    
                    protein_g: 0,
                    carbohydrates_total_g: 0,
                    fat_total_g: 0, 
                    fiber_g: 0,
                    potassium_mg: 0,
                    sugar_g: 0,                            
                    sodium_mg: 0,                    
                    fat_saturated_g: 0,
                    cholesterol_mg: 0,
                    serving_size_g: 0,
                }
            );

            // Add icons to the totals
            return [
                { nutrient: 'calories', value: totals.calories, icon: this.calories },
                { nutrient: 'protein', value: totals.protein_g, icon: this.protein },
                { nutrient: 'cabohydrates', value: totals.carbohydrates_total_g, icon: this.carbohydrates },
                { nutrient: 'fat', value: totals.fat_total_g, icon: this.totalFat },
                { nutrient: 'fiber', value: totals.fiber_g, icon: this.fiber },
                { nutrient: 'potassium', value: totals.potassium_mg, icon: this.potassium },
                { nutrient: 'sugar', value: totals.sugar_g, icon: this.sugar },                
                { nutrient: 'sodium', value: totals.sodium_mg, icon: this.sodium },
                { nutrient: 'saturated fat', value: totals.fat_saturated_g, icon: this.saturatedFat },
                { nutrient: 'cholesterol', value: totals.cholesterol_mg, icon: this.cholesterol },
                { nutrient: 'serving size / grams', value: totals.serving_size_g, icon: this.servingSize },
            ];
        },
    },
    methods: {
        handleAppendClick() {
            if (this.appendIcon === 'fa-magnifying-glass') {
                // If the icon is a magnifying glass, perform the search
                if (this.foodSearch) {
                    this.appendIcon = 'fa-right-to-bracket'; // Change the icon to bracket
                    this.search(); // Perform the search
                } else {
                    alert('Please enter a food item to search.');
                }
            } else if (this.appendIcon === 'fa-right-to-bracket') {
                // If the icon is a bracket, save to the database
                this.saveToDatabase();
            }
        },

        async saveToDatabase() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                alert('You must be logged in to save data.');
                return;
            }

            const userID = user.uid; // Get the user's UID
            const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
            const db = getDatabase(); // Initialize Firebase Realtime Database
            const dbPath = `/user/${userID}/food_logs/${currentDate}/`; // Path in the database

            try {
                // Check if the current date already exists
                const currentDataRef = dbRef(db, dbPath);
                const snapshot = await get(currentDataRef);

                if (snapshot.exists()) {
                    // If data exists, merge the new data with the existing data
                    const existingData = snapshot.val();
                    const updatedData = [...existingData, ...this.foodData]; // Merge arrays
                    await set(currentDataRef, updatedData); // Update the database
                } else {
                    // If no data exists for the current date, create a new record
                    await set(currentDataRef, this.foodData);
                }

                alert('Data saved successfully!');
            } catch (error) {
                console.error('Error saving data:', error);
                alert('Failed to save data. Please try again.');
            }
        },

        async search() {
            if (!this.foodSearch) {
                alert('Please enter a food item to search.');
                return;
            }
            const apiKey = '3Gfb2tkB5FW/acxBy795Bg==saOU9GMqHRkaJrty';
            const endpoint = `https://api.calorieninjas.com/v1/nutrition?query=${this.foodSearch}`;

            try {
                const response = await fetch(endpoint, {
                    headers: {
                        'X-Api-Key': apiKey,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                if (Array.isArray(data.items)) {
                    this.foodData = [...data.items];
                    console.log('Food data:', this.foodData);
                    
                } else {
                    console.error('Unexpected data format:', data);
                    alert('Unexpected data format received from the API.');
                    this.foodData = [];
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to fetch data. Please try again.');
            }
        },
    },
}
</script>