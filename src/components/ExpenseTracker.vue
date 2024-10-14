<template>
    <div class="expense-tracker">
      <!-- Balance Display -->
      <h4>Your Balance</h4>
      <h1 id="balance">${{ total }}</h1>
  
      <!-- Income and Expenses -->
      <div class="inc-exp-container">
        <div>
          <h4>Income</h4>
          <p id="money-plus" class="money plus">+${{ income }}</p>
        </div>
        <div>
          <h4>Expense</h4>
          <p id="money-minus" class="money minus">-${{ expenses }}</p>
        </div>
      </div>
  
      <!-- Add New Transaction -->
      <h3>Add new transaction</h3>
      <form id="form" @submit.prevent="onSubmit">
        <div class="form-control">
          <label for="text">Text</label>
          <input type="text" id="text" placeholder="Enter text..." v-model="text" />
        </div>
        <div class="form-control">
          <label for="amount">Amount <br />(negative - expense, positive - income)</label>
          <input type="text" id="amount" placeholder="Enter amount..." v-model="amount" />
        </div>
        <button class="btn">Add transaction</button>
      </form>
  
      <!-- Transaction History -->
      <h3>History</h3>
      <ul id="list" class="list">
        <li
          v-for="transaction in transactions"
          :key="transaction.id"
          :class="transaction.amount < 0 ? 'minus' : 'plus'"
        >
          {{ transaction.text }} <span>${{ transaction.amount }}</span>
          <button class="delete-btn" @click="deleteTransaction(transaction.id)">x</button>
        </li>
      </ul>
      <button class="btn return-btn" @click="goBack">Return</button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { db } from '@/firebase.js';
  import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
  import { useUserStore } from '@/stores/userStore';
  
  const transactions = ref([]);
  const text = ref('');
  const amount = ref('');
  const router = useRouter();
  const userStore = useUserStore(); // Access the user store
  
  // Computed values for total, income, and expenses
  const total = computed(() => transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0));
  const income = computed(() => transactions.value.filter(t => t.amount > 0).reduce((acc, transaction) => acc + transaction.amount, 0));
  const expenses = computed(() => transactions.value.filter(t => t.amount < 0).reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0));
  
  // Fetch transactions from Firestore on component mount
  onMounted(async () => {
    if (!userStore.email) return; // Exit if no user is found
  
    const transactionsRef = collection(db, 'transactions');
    onSnapshot(transactionsRef, (snapshot) => {
      transactions.value = snapshot.docs
        .filter(doc => doc.data().userEmail === userStore.email) // Ensure transactions belong to the logged-in user
        .map(doc => ({ id: doc.id, ...doc.data() }));
    });
  });
  
  // Function to handle form submission
  const onSubmit = async () => {
    if (!text.value || !amount.value) {
      alert('Both fields must be filled.');
      return;
    }
  
    if (!userStore.email) {
      alert('Please log in to add a transaction.');
      return;
    }
  
    const transactionData = {
      text: text.value,
      amount: parseFloat(amount.value),
      userEmail: userStore.email, // Save the user's email with the transaction
    };
  
    try {
      await addDoc(collection(db, 'transactions'), transactionData);
      text.value = '';
      amount.value = '';
    } catch (error) {
      console.error('Error adding transaction: ', error);
    }
  };
  
  // Function to delete a transaction
  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction: ', error);
    }
  };
  
  // Function to navigate back
  const goBack = () => {
    router.back();
  };
  </script>
  
  <style scoped>
  .expense-tracker {
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 8px;
    text-align: center;
  }
  
  .btn {
    margin-top: 10px;
    padding: 10px;
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  
  .return-btn {
    background-color: #f44336; /* Red color for the return button */
    margin-bottom: 20px;
  }
  
  .money.plus {
    color: green;
  }
  
  .money.minus {
    color: red;
  }
  </style>
  