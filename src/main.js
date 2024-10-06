// Import global CSS
import './assets/main.css';

// Import required libraries
import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import Pinia for state management

// Import your main App component and router
import App from './App.vue';
import router from './router';

// Create the Vue application instance
const app = createApp(App);

// Use Pinia for state management
app.use(createPinia());

// Use the router for navigating between pages
app.use(router);

// Mount the application to the DOM
app.mount('#app');
