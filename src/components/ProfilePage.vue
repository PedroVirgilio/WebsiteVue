<template>
  <div class="profile-page">
    <h2>User Profile</h2>
    <div class="user-info">
      <img :src="profilePictureUrl" alt="Profile Picture" width="50" height="50" />
      <p>{{ user.email }}</p>
    </div>

    <!-- Button to toggle password change form -->
    <button @click="togglePasswordChange" class="toggle-password-btn">Change Password</button>

    <!-- Show password fields only when changePasswordVisible is true -->
    <div v-if="changePasswordVisible">
      <div>
        <label for="currentPassword">Current Password:</label>
        <input type="password" id="currentPassword" v-model="currentPassword" placeholder="Enter your current password" />
      </div>

      <div>
        <label for="newPassword">New Password:</label>
        <input type="password" id="newPassword" v-model="newPassword" placeholder="Enter your new password" />
      </div>

      <button @click="updatePassword">Update Password</button>
    </div>

    <button @click="updateProfile">Update Profile</button>
    <button @click="goBack">Return to Homepage</button>

    <!-- Delete Account Button -->
    <button @click="confirmDeleteAccount" class="delete-account-btn">Delete Account</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { getAuth, updatePassword, signInWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'ProfilePage',
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;
    const profilePictureUrl = ref('https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png');
    const currentPassword = ref('');
    const newPassword = ref('');
    const changePasswordVisible = ref(false); // Flag to control visibility of password change form
    const userStore = useUserStore();

    // Load user profile picture if available
    if (user && user.photoURL) {
      profilePictureUrl.value = user.photoURL;
    }

    // Toggle the visibility of the password change form
    function togglePasswordChange() {
      changePasswordVisible.value = !changePasswordVisible.value;
    }

    // Update profile picture
    async function updateProfilePicture(event) {
      const file = event.target.files[0];
      if (file) {
        const storage = getStorage();
        const profilePicRef = storageRef(storage, `profilePictures/${user.uid}`);

        try {
          await uploadBytes(profilePicRef, file);
          const downloadURL = await getDownloadURL(profilePicRef);

          await updateProfile(user, { photoURL: downloadURL });
          userStore.updateProfilePicture(downloadURL);
          profilePictureUrl.value = downloadURL;
          alert('Profile picture updated successfully');
        } catch (error) {
          alert(`Failed to update profile picture: ${error.message}`);
        }
      } else {
        alert('Please select a file to upload.');
      }
    }

    // Update password
    const updatePasswordHandler = async () => {
      if (!currentPassword.value || !newPassword.value) {
        alert('Please fill in both the current and new passwords.');
        return;
      }

      try {
        const credential = await signInWithEmailAndPassword(auth, user.email, currentPassword.value);
        await updatePassword(credential.user, newPassword.value);
        alert('Password updated successfully.');
        changePasswordVisible.value = false; // Hide the form after successful update
      } catch (error) {
        alert(`Failed to update password: ${error.message}`);
      }
    };

    // Confirm and delete user account
    const confirmDeleteAccount = () => {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        deleteAccount();
      }
    };

    const deleteAccount = async () => {
      try {
        await deleteUser(user);
        alert('Your account has been successfully deleted.');
        router.push('/');
      } catch (error) {
        alert(`Failed to delete account: ${error.message}`);
      }
    };

    // Navigate back to the homepage
    function goBack() {
      router.push('/');
    }

    return {
      updateProfilePicture,
      confirmDeleteAccount,
      updatePassword: updatePasswordHandler,
      togglePasswordChange,
      goBack,
      user,
      profilePictureUrl,
      currentPassword,
      newPassword,
      changePasswordVisible, // Expose the flag
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
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.delete-account-btn {
  background-color: #e63946;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.delete-account-btn:hover {
  background-color: #d32f2f;
}
</style>
