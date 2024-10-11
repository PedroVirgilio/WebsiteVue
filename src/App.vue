<template>
  <header>
    <img alt="Painful Image" class="logo" src="https://paulbarrs.b-cdn.net/wp-content/uploads/2017/09/painful.jpg"
      width="250" height="250" />


    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink v-if="isAdmin" to="/admin">Admin Page</RouterLink> <!-- Conditionally render Admin link -->
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/DisplayMsg.vue';
import { useUserStore } from '@/stores/userStore'; // Import the user store

const userStore = useUserStore();
const isAdmin = userStore.isAdmin; // Check if the current user is an admin
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.logo {
  max-width: 100%; /* Makes the image responsive */
  height: auto; /* Maintains aspect ratio */
}


nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
