<template>
  <div class="homepage">
    <!-- Display user info if logged in -->
    <div v-if="user" class="user-info">
      <img :src="profilePicture" alt="Profile Picture" width="50" height="50" />
      <p>{{ email }}</p>
      <button class="auth-button" @click="goToProfile">Profile</button>
      <button class="auth-button" @click="signOut">Sign Out</button>
    </div>

    <!-- Show login and registration forms if not logged in -->
    <div v-else class="auth-container">
      <h2>{{ isRegistering ? 'Register' : 'Login' }}</h2>
      <form @submit.prevent="isRegistering ? register() : login()">
        <div>
          <input v-model="emailInput" type="email" placeholder="Email" required />
        </div>
        <div>
          <input v-model="passwordInput" type="password" placeholder="Password" required />
        </div>
        <button type="submit">{{ isRegistering ? 'Register' : 'Login' }}</button>
      </form>
      <p class="toggle-auth" @click="toggleRegister">{{ isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register' }}</p>
    </div>

    <!-- Action buttons -->
    <div class="button-container">
      <button class="action-button" @click="goToTodoApp">Button 1 - Go to To-Do App</button>
      <button class="action-button" @click="goToProjectManagement">Button 2 - Project Management</button>
      <!-- Conditionally render Button 3 for admins only -->
      <button v-if="isAdmin" class="action-button" @click="goToAdminPage">Button 3 - Admin Page</button>
      <button class="action-button" @click="goToWeatherApp">Button 4 - Weather App</button> 
      <button class="action-button" @click="goToExpenseTracker">Button 5: Expense Tracker</button>
      <!--<button class="action-button">Button 6</button>-->
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useUserStore } from '@/stores/userStore'; // Import the user store

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const userStore = useUserStore(); // Use the user store
    const user = ref(null);
    const email = ref('');
    const profilePicture = ref('');

    // Local state for email and password input
    const emailInput = ref('');
    const passwordInput = ref('');
    const isRegistering = ref(false); // Toggle between login and registration

    // Computed property to check if the current user is an admin
    const isAdmin = computed(() => userStore.isAdmin);

    // Check authentication state
    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;

        // Update user store and local refs when authentication state changes
        if (currentUser) {
          userStore.setUser(currentUser); // Set the user in the store
          email.value = currentUser.email;
          profilePicture.value = currentUser.photoURL || 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png'; // Set default image if none
        } else {
          userStore.setUser({ email: '', photoURL: '' }); // Clear user data
          email.value = ''; // Clear email
          profilePicture.value = ''; // Clear profile picture
        }
      });
    });

    // Function to navigate to the To-Do App
    const goToTodoApp = () => {
      router.push('/todo');
    };

    // Function to navigate to the Profile Page
    const goToProfile = () => {
      router.push('/profile');
    };

    // Function to navigate to Project Management
    const goToProjectManagement = () => {
      router.push('/project-management');
    };

    // Function to navigate to the Admin Page
    const goToAdminPage = () => {
      router.push('/admin');
    };
    

    // Function to sign out the user
    const signOutUser = async () => {
      try {
        await signOut(auth);
        alert('Signed out successfully');
      } catch (error) {
        alert(`Sign out failed: ${error.message}`);
      }
    };

    // Login function
    const login = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        alert('Logged in successfully');
        // Update user information in the store
        userStore.setUser({
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL || 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png',
        });
        emailInput.value = ''; // Clear input
        passwordInput.value = ''; // Clear input
      } catch (error) {
        alert(`Login failed: ${error.message}`);
      }
    };

    // Registration function
    const register = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        alert('Registered successfully');
        // Automatically log in after registration
        await login(); // Call login after successful registration
      } catch (error) {
        alert(`Registration failed: ${error.message}`);
      }
    };

    // Toggle between login and registration
    const toggleRegister = () => {
      isRegistering.value = !isRegistering.value;
      emailInput.value = ''; // Clear input
      passwordInput.value = ''; // Clear input
    };
  const goToWeatherApp = () => {
  router.push('/weather'); 
};

const goToExpenseTracker = () => {
  router.push('/expense-tracker');
};

    return {
      goToTodoApp,
      goToProfile,
      goToProjectManagement,
      goToAdminPage, 
      goToWeatherApp,
      goToExpenseTracker,
      signOut: signOutUser,
      login,
      register,
      toggleRegister,
      user,
      email,
      profilePicture,
      emailInput,
      passwordInput,
      isRegistering,
      isAdmin, 
    };
  },
};
</script>

<style scoped>
.homepage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
}

.auth-container {
  text-align: center;
  margin-bottom: 20px;
}

.auth-container form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-container input {
  margin: 5px 0;
  padding: 10px;
  width: 200px;
}

.toggle-auth {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}

.button-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.action-button {
  padding: 15px;
  font-size: 16px;
  cursor: pointer;
}

.user-info {
  position: fixed; 
  top: 10px; /* Adjust to top right */
  right: 10px;
  display: flex;
  align-items: center;
}

.user-info img {
  border-radius: 50%;
  margin-right: 10px;
}

.user-info p {
  font-size: 14px;
  font-weight: bold;
  margin-right: 10px;
}
</style>
