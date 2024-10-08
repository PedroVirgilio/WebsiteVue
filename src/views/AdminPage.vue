<template>
    <div>
      <h1>Admin Page</h1>
      <input v-model="newAdminEmail" placeholder="Enter new admin email" />
      <button @click="addNewAdmin">Add Admin</button>
  
      <h2>Current Admins</h2>
      <ul>
        <li v-for="admin in admins" :key="admin">
          {{ admin }}
          <button @click="removeAdmin(admin)">Remove</button>
        </li>
      </ul>
      <button @click="goBack" class="return-button">Return Home</button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { useRouter } from 'vue-router'; // Import useRouter for navigation
  
  const userStore = useUserStore();
  const router = useRouter(); // Initialize router
  const newAdminEmail = ref('');
  
  // Use computed property for reactive access to the admin list
  const admins = computed(() => userStore.admins);
  
  const addNewAdmin = () => {
    if (newAdminEmail.value) {
      userStore.addAdmin(newAdminEmail.value);
      newAdminEmail.value = ''; // Clear input after adding
    }
  };
  
  const removeAdmin = (email) => {
    userStore.removeUser(email); // Call removeUser action from the store
  };
  
  // Function to go back to the previous page
  const goBack = () => {
    router.push('/'); // Redirect to Home Page
  };
  </script>
  
  
  <style scoped>
  /* Your styles for the admin page */
  .return-button {
    margin-top: 20px;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  