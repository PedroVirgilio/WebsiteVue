import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    profilePicture: 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png', // Default picture
    admins: ['admin1@gmail.com'], // Hardcoded initial admin email
  }),
  getters: {
    isAdmin(state) {
      return state.admins.includes(state.email);
    }
  },
  actions: {
    setUser(user) {
      this.email = user.email || '';
      this.profilePicture = user.photoURL || this.profilePicture;
    },
    clearUser() {
      this.email = '';
      this.profilePicture = 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png';
    },
    updateProfilePicture(newPicture) {
      this.profilePicture = newPicture;
    },
    updateEmail(newEmail) {
      this.email = newEmail;
    },
    addAdmin(newAdminEmail) {
      if (this.isAdmin) {
        if (!this.admins.includes(newAdminEmail)) {
          this.admins.push(newAdminEmail);
          console.log(`${newAdminEmail} has been added as an admin.`);
        } else {
          console.log(`${newAdminEmail} is already an admin.`);
        }
      } else {
        console.log("You don't have permission to add new admins.");
      }
    },
    removeUser(emailToRemove) {
      if (this.isAdmin) {
        const index = this.admins.indexOf(emailToRemove);
        if (index !== -1) {
          this.admins.splice(index, 1);
          console.log(`User with email ${emailToRemove} has been removed from admins.`);
        } else {
          console.log(`${emailToRemove} is not an admin.`);
        }
      } else {
        console.log("You don't have permission to remove users.");
      }
    }
  },
});
