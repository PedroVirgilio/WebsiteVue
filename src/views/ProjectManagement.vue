<template>
    <div class="project-management">
      <!-- Return button -->
      <button @click="goBack" class="return-button">Return to Home</button>
  
      <!-- Project selection -->
      <div>
        <label for="projectSelect">Select Project:</label>
        <select id="projectSelect" v-model="selectedProject">
          <option value="" disabled>Select a project</option>
          <option v-for="project in projects" :key="project.name" :value="project">{{ project.name }}</option>
        </select>
      </div>
  
      <div class="columns">
        <!-- Project column -->
        <div class="column">
          <h3>Project</h3>
          <input v-model="projectName" placeholder="Enter project name" />
          <button @click="createProject">Create Project</button>
        </div>
  
        <!-- Feature column -->
        <div class="column" v-if="selectedProject">
          <h3>Feature</h3>
          <ul>
            <li v-for="feature in selectedProject.features" :key="feature">{{ feature }}</li>
          </ul>
          <input v-model="newFeature" placeholder="Add a feature" />
          <button @click="addFeature">Add Feature</button>
        </div>
  
        <!-- Bug column -->
        <div class="column" v-if="selectedProject">
          <h3>Bug</h3>
          <ul>
            <li v-for="bug in selectedProject.bugs" :key="bug">{{ bug }}</li>
          </ul>
          <input v-model="newBug" placeholder="Add a bug" />
          <button @click="addBug">Add Bug</button>
        </div>
  
        <!-- Users column -->
        <div class="column" v-if="selectedProject">
          <h3>Users</h3>
          <ul>
            <li v-for="user in selectedProject.users" :key="user.email">{{ user.email }}</li>
          </ul>
          <input v-model="userEmail" placeholder="Enter user email to associate" />
          <button @click="associateUser">Add User</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  
  export default {
    name: 'ProjectManagement',
    setup() {
      const router = useRouter();
      const userStore = useUserStore();
      const projectName = ref('');
      const newFeature = ref('');
      const newBug = ref('');
      const userEmail = ref('');
      const selectedProject = ref(null);
      const projects = ref([]); // Array to hold created projects
      const userEmailCurrent = userStore.email; // Store user's email
  
      function goBack() {
        router.push('/');
      }
  
      function createProject() {
        if (!projectName.value) return alert('Please enter a project name');
  
        // Create a new project object
        const newProject = {
          name: projectName.value,
          features: [],
          bugs: [],
          users: [{ email: userEmailCurrent }], // Automatically associate creator
        };
  
        // Add the new project to the projects array
        projects.value.push(newProject);
        selectedProject.value = newProject; // Set the newly created project as selected
        projectName.value = ''; // Clear the project name input
  
        alert(`Project ${newProject.name} created successfully!`);
      }
  
      function addFeature() {
        if (!newFeature.value) return alert('Please enter a feature');
        selectedProject.value.features.push(newFeature.value);
        newFeature.value = '';
      }
  
      function addBug() {
        if (!newBug.value) return alert('Please enter a bug');
        selectedProject.value.bugs.push(newBug.value);
        newBug.value = '';
      }
  
      function associateUser() {
        if (!userEmail.value) return alert('Please enter an email');
        selectedProject.value.users.push({ email: userEmail.value });
        userEmail.value = '';
      }
  
      // Watch for changes in the selected project
      watch(selectedProject, (newProject) => {
        if (newProject) {
          // Clear input fields if a project is selected
          newFeature.value = '';
          newBug.value = '';
          userEmail.value = '';
        }
      });
  
      return {
        projectName,
        newFeature,
        newBug,
        userEmail,
        selectedProject,
        projects,
        createProject,
        addFeature,
        addBug,
        associateUser,
        goBack,
      };
    },
  };
  </script>
  
  <style scoped>
  .project-management {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  
  .column {
    border: 1px solid #ddd;
    padding: 10px;
  }
  
  .return-button {
    background-color: #3498db;
    color: white;
    padding: 10px;
    margin-bottom: 20px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
  }
  
  .return-button:hover {
    background-color: #2980b9;
  }
  </style>
  