// src/stores/projectStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProjectStore = defineStore('projectStore', () => {
  const projects = ref(loadProjectsFromLocalStorage() || []);
  const selectedProject = ref(null);

  // Load projects from local storage
  function loadProjectsFromLocalStorage() {
    const storedProjects = localStorage.getItem('projects');
    return storedProjects ? JSON.parse(storedProjects) : null;
  }

  // Save projects to local storage
  function saveProjectsToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projects.value));
  }

  // Create a new project and associate the creator's email
  function createProject(projectName, creatorEmail) {
    const newProject = {
      name: projectName,
      features: [],
      bugs: [],
      users: [{ email: creatorEmail }],
    };
    projects.value.push(newProject);
    saveProjectsToLocalStorage(); // Save to local storage
    selectedProject.value = newProject; // Automatically select the new project
  }

  // Add a feature to the selected project
  function addFeature(projectName, feature) {
    const project = projects.value.find(p => p.name === projectName);
    if (project) {
      project.features.push(feature); // Make sure to push the feature to the correct project
      saveProjectsToLocalStorage(); // Save to local storage
    }
  }

  // Delete a feature from the selected project
  function deleteFeature(projectName, feature) {
    const project = projects.value.find(p => p.name === projectName);
    if (project) {
      project.features = project.features.filter(f => f !== feature); // Remove the feature
      saveProjectsToLocalStorage(); // Save to local storage
    }
  }

  // Add a bug to the selected project
  function addBug(projectName, bug) {
    const project = projects.value.find(p => p.name === projectName);
    if (project) {
      project.bugs.push(bug); // Make sure to push the bug to the correct project
      saveProjectsToLocalStorage(); // Save to local storage
    }
  }

  // Delete a bug from the selected project
  function deleteBug(projectName, bug) {
    const project = projects.value.find(p => p.name === projectName);
    if (project) {
      project.bugs = project.bugs.filter(b => b !== bug); // Remove the bug
      saveProjectsToLocalStorage(); // Save to local storage
    }
  }

  // Associate a user with the selected project
  function associateUser(projectName, email) {
    const project = projects.value.find(p => p.name === projectName);
    if (project) {
      // Ensure the user is not already associated
      if (!project.users.some(user => user.email === email)) {
        project.users.push({ email }); // Make sure to push the user to the correct project
        saveProjectsToLocalStorage(); // Save to local storage
      }
    }
  }

  // Delete a project by name
  function deleteProject(projectName) {
    projects.value = projects.value.filter(project => project.name !== projectName); // Remove the project
    saveProjectsToLocalStorage(); // Save to local storage
    // Optionally, reset the selectedProject if the deleted one was selected
    if (selectedProject.value && selectedProject.value.name === projectName) {
      selectedProject.value = null;
    }
  }

  // Function to get projects for a user
  function getProjectsForUser(email) {
    return projects.value.filter(project => project.users.some(user => user.email === email));
  }

  return {
    projects,
    selectedProject,
    createProject,
    addFeature,
    deleteFeature,
    addBug,
    deleteBug,
    associateUser,
    deleteProject,
    getProjectsForUser, // Expose the function to retrieve user-specific projects
  };
});
