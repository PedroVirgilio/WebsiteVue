import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    profilePicture: 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png', // Default picture
  }),
  actions: {
    setUser(user) {
      this.email = user.email || ''; // Default to an empty string if undefined
      this.profilePicture = user.photoURL || this.profilePicture; // Use default picture if user doesn't have one
    },
    clearUser() {
      this.email = '';
      this.profilePicture = 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png'; // Reset to default
      
    },
    updateProfilePicture(newPicture) {
      this.profilePicture = newPicture;
    },
    updateEmail(newEmail) {
      this.email = newEmail;
    },
  },
});
