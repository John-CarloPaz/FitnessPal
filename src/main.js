import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse, faUtensils, faMagnifyingGlass, faRightToBracket, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { initializeApp } from 'firebase/app';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

library.add(
    faHouse,
    faUtensils,
    faMagnifyingGlass,
    faRightToBracket,
    faCalculator,
    faChevronLeft
)

const firebaseConfig = {
    apiKey: "AIzaSyC1U_Dfmr2CsAHs4IMuhTm2d4Z0TbHPb1o",
    authDomain: "iptl-e6542.firebaseapp.com",
    databaseURL: "https://iptl-e6542-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iptl-e6542",
    storageBucket: "iptl-e6542.firebasestorage.app",
    messagingSenderId: "643849309338",
    appId: "1:643849309338:web:b189dfa94369afdd816323",
    measurementId: "G-BKXKYCVNVE"
  };

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'fa',
        sets: {
            fa: {
                component: FontAwesomeIcon,
            },
        },
    }
  })

initializeApp(firebaseConfig);
const app = createApp(App);
app.use(router);
app.use(vuetify); 
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');