<template>
  <div class="profile-page">
    <h2>User Profile</h2>
    <div class="user-info">
      <img :src="profilePictureUrl" alt="Profile Picture" width="50" height="50" />
      <p>{{ user.email }}</p>
    </div>

    <!-- Change Profile Picture Section -->
    <div class="change-picture">
      <label class="custom-file-upload button">
        Change Profile Picture
        <input type="file" @change="updateProfilePicture" />
      </label>
      <p v-if="fileSelectedMessage && !isPictureSelected">{{ fileSelectedMessage }}</p>
    </div>

    <!-- Change Password -->
    <button @click="togglePasswordChange" class="button">Change Password</button>

    <div v-if="changePasswordVisible" class="password-section">
      <div>
        <label for="currentPassword">Current Password:</label>
        <input type="password" id="currentPassword" v-model="currentPassword" placeholder="Enter current password" />
      </div>

      <div>
        <label for="newPassword">New Password:</label>
        <input type="password" id="newPassword" v-model="newPassword" placeholder="Enter new password" />
      </div>

      <button @click="updatePassword" class="button">Update Password</button>
    </div>

    <button @click="goBack" class="button">Return to Homepage</button>
    <button @click="confirmDeleteAccount" class="button delete-account-btn">Delete Account</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, updatePassword, signInWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'ProfilePage',
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;
    const userStore = useUserStore();

    const profilePictureUrl = ref(user.photoURL || 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png');
    const currentPassword = ref('');
    const newPassword = ref('');
    const changePasswordVisible = ref(false);
    const fileSelectedMessage = ref('No file selected');
    const isPictureSelected = ref(false);

    const togglePasswordChange = () => {
      changePasswordVisible.value = !changePasswordVisible.value;
    };

    const updateProfilePicture = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const storage = getStorage();
        const profilePicRef = storageRef(storage, `profilePictures/${user.uid}`);
        isPictureSelected.value = true; // Hide message after file is selected

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
      }
    };

    const updatePassword = async () => {
      if (!currentPassword.value || !newPassword.value) {
        alert('Please fill in both the current and new passwords.');
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, user.email, currentPassword.value);
        await updatePassword(user, newPassword.value);
        alert('Password updated successfully.');
        changePasswordVisible.value = false;
      } catch (error) {
        alert(`Failed to update password: ${error.message}`);
      }
    };

    const confirmDeleteAccount = () => {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        deleteUserAccount();
      }
    };

    const deleteUserAccount = async () => {
      try {
        await deleteUser(user);
        alert('Account successfully deleted.');
        router.push('/');
      } catch (error) {
        alert(`Failed to delete account: ${error.message}`);
      }
    };

    const goBack = () => {
      router.push('/');
    };

    return {
      profilePictureUrl,
      user,
      currentPassword,
      newPassword,
      changePasswordVisible,
      fileSelectedMessage,
      isPictureSelected,
      togglePasswordChange,
      updateProfilePicture,
      updatePassword,
      confirmDeleteAccount,
      goBack,
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

.user-info, .change-picture, .password-section {
  margin-bottom: 20px;
  text-align: center;
}

/* Uniform button styling */
.button {
  width: 200px;
  padding: 10px 20px;
  margin: 10px;
  text-align: center;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

/* Specific style for the custom file upload label */
.custom-file-upload {
  display: inline-block;
}

/* Additional styling for the delete account button */
.delete-account-btn {
  background-color: #e63946;
}

.delete-account-btn:hover {
  background-color: #d32f2f;
}

input[type="file"] {
  display: none; /* Hide the default file input */
}

input[type="password"] {
  width: 200px;
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
