<template>
    <div class="todo-app">
      <h2>To-Do App</h2>
      <input v-model="newTask" placeholder="Add a new task" />
      <button @click="addTask">Add Task</button>
  
      <ul>
        <li v-for="task in tasks" :key="task.id">
          {{ task.text }}
          <button @click="removeTask(task.id)">Remove</button>
        </li>
      </ul>
  
      <!-- Return button to go back to the homepage -->
      <button class="return-button" @click="goHome">Return to Home</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'; // Import ref and onMounted
  import { useRouter } from 'vue-router'; // Import useRouter
  
  export default {
    setup() {
      const router = useRouter(); // Get the router instance
      const newTask = ref(''); // Reactive variable for new task input
      const tasks = ref([]); // Reactive variable for tasks
  
      // Load tasks from local storage when the component is mounted
      onMounted(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
          tasks.value = storedTasks; // Populate tasks with stored tasks
        }
      });
  
      // Save tasks to local storage whenever tasks change
      const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks.value));
      };
  
      function addTask() {
        if (newTask.value) {
          tasks.value.push({ id: Date.now(), text: newTask.value });
          newTask.value = ''; // Clear the input after adding
          saveTasks(); // Save tasks to local storage
        }
      }
  
      function removeTask(taskId) {
        tasks.value = tasks.value.filter(task => task.id !== taskId);
        saveTasks(); // Save updated tasks to local storage
      }
  
      function goHome() {
        router.push('/'); // Navigate back to the homepage
      }
  
      return {
        newTask,
        tasks,
        addTask,
        removeTask,
        goHome,
      };
    },
  };
  </script>
  
  <style scoped>
  .todo-app {
    text-align: center;
  }
  
  input {
    margin-right: 10px;
  }
  
  .return-button {
    margin-top: 20px; /* Add some spacing */
    padding: 10px 15px; /* Button styling */
    font-size: 16px;
    cursor: pointer;
  }
  
  ul {
    list-style-type: none; /* Remove default list styles */
    padding: 0; /* Remove padding */
  }
  
  li {
    display: flex; /* Use flexbox for alignment */
    justify-content: space-between; /* Space between text and button */
    align-items: center; /* Center vertically */
    margin: 10px 0; /* Space between list items */
  }
  
  .remove-button {
    width: 80px; /* Set a fixed width for remove buttons */
    padding: 5px; /* Adjust padding as needed */
    cursor: pointer;
  }
  </style>
  
  