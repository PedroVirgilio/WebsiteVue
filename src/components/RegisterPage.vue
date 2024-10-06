<template>
    <div class="register-page">
      <h2>Register</h2>
      <form @submit.prevent="registerUser">
        <div>
          <input v-model="email" type="email" placeholder="Email" required />
        </div>
        <div>
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <button type="submit">Register</button>
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '@/firebase';
  
  export default {
    name: 'RegisterPage',
    setup() {
      const email = ref('');
      const password = ref('');
  
      const registerUser = async () => {
        try {
          await createUserWithEmailAndPassword(auth, email.value, password.value);
          console.log('Registration successful');
        } catch (error) {
          console.error('Error registering user:', error);
        }
      };
  
      return { email, password, registerUser };
    },
  };
  </script>
  
  <style scoped>
    /* Add some styles here */
  </style>
  