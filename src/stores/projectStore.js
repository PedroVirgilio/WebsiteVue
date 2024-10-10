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
      project.features.push({
        name: feature,
        claimedBy: null // Add claimedBy field
      }); 
      saveProjectsToLocalStorage(); // Save to local storage
    }
  }

  // Delete a feature from the selected project
  function deleteFeature(projectName, featureName) {
    const project = this.projects.find((project) => project.name === projectName);
    if (project) {
      project.features = project.features.filter((feature) => feature.name !== featureName);
    }
  }

  // Add a bug to the selected project
  function addBug(projectName, bug) {
    const project = projects.value.find(p => p.name === projectName);
    if (project) {
      project.bugs.push({
        name: bug,
        claimedBy: null // Add claimedBy field
      }); 
      saveProjectsToLocalStorage(); // Save to local storage
    }
  }

  // Delete a bug from the selected project
  function deleteBug(projectName, bugName) {
    const project = this.projects.find((project) => project.name === projectName);
    if (project) {
      project.bugs = project.bugs.filter((bug) => bug.name !== bugName);
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

  // Claim a feature by setting the claimedBy property to the user's email
  function claimFeature(projectName, featureName, userEmail) {
    const project = projects.value.find(p => p.name === projectName);
    if (project) {
      const feature = project.features.find(f => f.name === featureName);
      if (feature && !feature.claimedBy) {  // Ensure the feature hasn't been claimed yet
        feature.claimedBy = userEmail;
        saveProjectsToLocalStorage();  // Save changes to local storage or database
      }
    }
  }

  // Claim a bug by setting the claimedBy property to the user's email
  function claimBug(projectName, bugName, userEmail) {
    const project = projects.value.find(p => p.name === projectName);
    if (project) {
      const bug = project.bugs.find(b => b.name === bugName);
      if (bug && !bug.claimedBy) {  // Ensure the bug hasn't been claimed yet
        bug.claimedBy = userEmail;
        saveProjectsToLocalStorage();  // Save changes to local storage or database
      }
    }
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
    claimFeature, // Expose claimFeature
    claimBug, // Expose claimBug
  };
});
