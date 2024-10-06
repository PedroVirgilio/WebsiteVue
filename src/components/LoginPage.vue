<template>
    <div class="login-page">
      <h2>Login</h2>
      <form @submit.prevent="loginUser">
        <div>
          <input v-model="email" type="email" placeholder="Email" required />
        </div>
        <div>
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <button type="submit">Login</button>
        <p>Don't have an account? <router-link to="/register">Register</router-link></p>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '@/firebase';
  
  export default {
    name: 'LoginPage',
    setup() {
      const email = ref('');
      const password = ref('');
  
      const loginUser = async () => {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          console.log('Login successful');
        } catch (error) {
          console.error('Error logging in:', error);
        }
      };
  
      return { email, password, loginUser };
    },
  };
  </script>
  
  <style scoped>
    /* Add some styles here */
  </style>
  