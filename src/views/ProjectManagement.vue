<template>
  <div class="project-management">
    <!-- Return button -->
    <button @click="goBack" class="return-button">Return to Home</button>

    <!-- Project selection -->
    <div>
      <label for="projectSelect">Select Project:</label>
      <select id="projectSelect" v-model="selectedProjectName" @change="onSelectProject">
        <option value="" disabled>Select a project</option>
        <option value="create-new">Create New Project</option>
        <option v-for="project in userProjects" :key="project.name" :value="project.name">{{ project.name }}</option>
      </select>
    </div>

    <!-- Project creation input -->
    <div v-if="isCreatingNewProject" class="column">
      <h3>Create New Project</h3>
      <input v-model="projectName" placeholder="Enter project name" />
      <button @click="createProject">Create Project</button>
    </div>

    <div class="columns" v-if="selectedProject">
      <!-- Delete project button -->
      <div class="column">
        <button @click="deleteProject" class="delete-button">Delete Project</button>
      </div>

      <!-- Feature column -->
      <div class="column">
        <h3>Feature</h3>
        <ul>
          <li v-for="feature in selectedProject.features" :key="feature">
            {{ feature }}
            <button @click="deleteFeature(feature)" class="delete-button">Delete</button>
          </li>
        </ul>
        <input v-model="newFeature" placeholder="Add a feature" />
        <button @click="addFeature">Add Feature</button>
      </div>

      <!-- Bug column -->
      <div class="column">
        <h3>Bug</h3>
        <ul>
          <li v-for="bug in selectedProject.bugs" :key="bug">
            {{ bug }}
            <button @click="deleteBug(bug)" class="delete-button">Delete</button>
          </li>
        </ul>
        <input v-model="newBug" placeholder="Add a bug" />
        <button @click="addBug">Add Bug</button>
      </div>

      <!-- Users column -->
      <div class="column">
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
import { useProjectStore } from '@/stores/projectStore'; // Import the project store
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'ProjectManagement',
  setup() {
    const router = useRouter();
    const projectStore = useProjectStore();
    const userStore = useUserStore();

    const projectName = ref('');
    const newFeature = ref('');
    const newBug = ref('');
    const userEmail = ref('');

    const userEmailCurrent = userStore.email; // Store the user's email
    const selectedProjectName = ref('');
    const selectedProject = ref(null); // The selected project object
    const isCreatingNewProject = ref(false); // Track whether the "Create New Project" option is selected

    const userProjects = ref(projectStore.getProjectsForUser(userEmailCurrent)); // Initialize the user projects

    function goBack() {
      router.push('/');
    }

    function createProject() {
      if (!projectName.value) return alert('Please enter a project name');

      // Create the project
      projectStore.createProject(projectName.value, userEmailCurrent);
      // Refresh user projects
      userProjects.value = projectStore.getProjectsForUser(userEmailCurrent); 
      // Select the newly created project
      selectedProjectName.value = projectName.value; // Automatically select the new project
      onSelectProject(); // Call this function to set selectedProject correctly
      isCreatingNewProject.value = false; // Hide the create project section
      projectName.value = ''; // Clear input
    }

    function deleteProject() {
      if (confirm(`Are you sure you want to delete the project "${selectedProject.name}"?`)) {
        projectStore.deleteProject(selectedProject.value.name); // Call the store method to delete the project
        userProjects.value = projectStore.getProjectsForUser(userEmailCurrent); // Refresh user projects
        selectedProject.value = null; // Clear selected project
        selectedProjectName.value = ''; // Reset selection
      }
    }

    function addFeature() {
      if (!newFeature.value) return alert('Please enter a feature');
      const feature = newFeature.value;
      projectStore.addFeature(selectedProject.value.name, feature); // Pass project name to store the feature
      newFeature.value = ''; // Clear input
    }

    function deleteFeature(feature) {
      if (confirm(`Are you sure you want to delete the feature "${feature}"?`)) {
        projectStore.deleteFeature(selectedProject.value.name, feature); // Call the store method to delete the feature
      }
    }

    function addBug() {
      if (!newBug.value) return alert('Please enter a bug');
      const bug = newBug.value;
      projectStore.addBug(selectedProject.value.name, bug); // Pass project name to store the bug
      newBug.value = ''; // Clear input
    }

    function deleteBug(bug) {
      if (confirm(`Are you sure you want to delete the bug "${bug}"?`)) {
        projectStore.deleteBug(selectedProject.value.name, bug); // Call the store method to delete the bug
      }
    }

    function associateUser() {
      if (!userEmail.value) return alert('Please enter an email');
      projectStore.associateUser(selectedProject.value.name, userEmail.value); // Pass project name to associate the user
      userEmail.value = ''; // Clear input
    }

    function onSelectProject() {
      if (selectedProjectName.value === 'create-new') {
        isCreatingNewProject.value = true; // Show project creation input
        selectedProject.value = null; // No project selected while creating new
      } else {
        isCreatingNewProject.value = false; // Hide project creation input
        // Find the selected project
        selectedProject.value = projectStore.projects.find((project) => project.name === selectedProjectName.value);
        // Reset input fields
        newFeature.value = '';
        newBug.value = '';
        userEmail.value = '';
      }
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
      selectedProjectName,
      isCreatingNewProject,
      userProjects, // Use this to display projects
      createProject,
      deleteProject, // Expose deleteProject function
      addFeature,
      deleteFeature, // Expose deleteFeature function
      addBug,
      deleteBug, // Expose deleteBug function
      associateUser,
      onSelectProject,
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

.delete-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 5px;
}

.delete-button:hover {
  background-color: #c0392b;
}
</style>
