<template>
  <div class="todo-app">
    <h2>To-Do App</h2>
    <div class="input-container">
      <input v-model="newTask" placeholder="Add a new task" />
      <button @click="addTask">Add Task</button>
    </div>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        <!-- Apply the completed class only to the task text -->
        <span :class="{ completed: task.completed }">{{ task.text }}</span>
        <div class="task-buttons">
          <button @click="completeTask(task.id)">
            {{ task.completed ? "Undo" : "Complete" }}
          </button>
          <button class="remove-button" @click="removeTask(task.id)">Remove</button>
        </div>
      </li>
    </ul>

    <!-- Return button to go back to the homepage -->
    <button class="return-button" @click="goHome">Return to Home</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const newTask = ref('');
    const tasks = ref([]);

    onMounted(() => {
      const storedTasks = JSON.parse(localStorage.getItem('tasks'));
      if (storedTasks) {
        tasks.value = storedTasks;
      }
    });

    const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks.value));
    };

    function addTask() {
      if (newTask.value) {
        tasks.value.push({ id: Date.now(), text: newTask.value, completed: false });
        newTask.value = '';
        saveTasks();
      }
    }

    function removeTask(taskId) {
      tasks.value = tasks.value.filter(task => task.id !== taskId);
      saveTasks();
    }

    function completeTask(taskId) {
      const task = tasks.value.find(task => task.id === taskId);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
      }
    }

    function goHome() {
      router.push('/');
    }

    return {
      newTask,
      tasks,
      addTask,
      removeTask,
      completeTask,
      goHome,
    };
  },
};
</script>

  
<style scoped>
.todo-app {
  text-align: center;
}

.input-container {
  margin-bottom: 20px;
}

input {
  margin-right: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.completed {
  text-decoration: line-through;
  color: red; /* Completed task text will be red */
}

.task-buttons {
  display: flex;
  gap: 10px;
}

button {
  cursor: pointer;
}

.remove-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
}

.return-button {
  margin-top: 20px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
}

button[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
