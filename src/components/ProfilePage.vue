<template>
  <div class="profile-page">
    <h2>User Profile</h2>
    <div class="user-info">
      <img :src="profilePictureUrl" alt="Profile Picture" width="50" height="50" />
      <p>{{ user.email }}</p>
    </div>

    <div>
      <label for="currentPassword">Current Password:</label>
      <input type="password" id="currentPassword" v-model="currentPassword" placeholder="Enter your current password" />
    </div>

    <div>
      <label for="profilePicture">Profile Picture:</label>
      <input type="file" id="profilePicture" @change="updateProfilePicture" />
    </div>

    <button @click="updateProfile">Update Profile</button>
    <button @click="goBack">Return to Homepage</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUserStore } from '@/stores/userStore'; // Import the user store

export default {
  name: 'ProfilePage',
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;
    const profilePictureUrl = ref('https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png');
    const currentPassword = ref('');
    const userStore = useUserStore(); // Use the user store

    // Load user profile picture if available
    if (user && user.photoURL) {
      profilePictureUrl.value = user.photoURL;
    }

    // Update profile picture
    async function updateProfilePicture(event) {
      const file = event.target.files[0];
      if (file) {
        const storage = getStorage(); // Initialize Firebase Storage
        const profilePicRef = storageRef(storage, `profilePictures/${user.uid}`); // Reference to where the image will be stored

        try {
          // Upload the image
          await uploadBytes(profilePicRef, file);
          // Get the image URL
          const downloadURL = await getDownloadURL(profilePicRef);

          // Update the profile picture URL in Firebase Authentication
          await updateProfile(user, { photoURL: downloadURL });
          // Update the state in the user store
          userStore.updateProfilePicture(downloadURL); // Update the picture in the store
          profilePictureUrl.value = downloadURL; 
          alert('Profile picture updated successfully');
        } catch (error) {
          alert(`Failed to update profile picture: ${error.message}`);
        }
      } else {
        alert('Please select a file to upload.');
      }
    }

    // Navigate back to the homepage
    function goBack() {
      router.push('/');
    }

    return {
      updateProfilePicture,
      goBack,
      user,
      profilePictureUrl,
      currentPassword,
    };
  },
};
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-top: 10px;
}

input {
  margin-bottom: 20px;
}

button {
  margin: 10px;
}
</style>
