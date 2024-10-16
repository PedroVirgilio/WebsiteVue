import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from './userStore';

export const useTransactionStore = defineStore('transactionStore', () => {
  const userStore = useUserStore();
  const transactions = ref(loadTransactionsFromLocalStorage() || []);
  const balance = ref(loadBalanceFromLocalStorage() || 0);

  // Load transactions from local storage
  function loadTransactionsFromLocalStorage() {
    const storedTransactions = localStorage.getItem('transactions');
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  }

  // Save transactions to local storage
  function saveTransactionsToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions.value));
  }

  // Load balance from local storage
  function loadBalanceFromLocalStorage() {
    const storedBalance = localStorage.getItem('balance');
    return storedBalance ? JSON.parse(storedBalance) : 0;
  }

  // Save balance to local storage
  function saveBalanceToLocalStorage() {
    localStorage.setItem('balance', JSON.stringify(balance.value));
  }

  // Generate a simple unique ID for each transaction
  function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Add a new transaction
  function addTransaction(text, amount) {
    const newTransaction = {
      id: generateId(),
      text,
      amount: parseFloat(amount), // Ensure amount is parsed as a float
      email: userStore.email, // Associate transaction with the logged-in user
    };
    
    // Push the new transaction and update balance
    transactions.value.push(newTransaction);
    balance.value += newTransaction.amount; // Update balance
    saveTransactionsToLocalStorage(); // Save updated transactions
    saveBalanceToLocalStorage(); // Save updated balance
  }

  // Delete a transaction
  function deleteTransaction(id) {
    const transactionToRemove = transactions.value.find(t => t.id === id);
    if (transactionToRemove) {
      balance.value -= transactionToRemove.amount; // Adjust balance
      transactions.value = transactions.value.filter(t => t.id !== id);
      saveTransactionsToLocalStorage(); // Save updated transactions
      saveBalanceToLocalStorage(); // Save updated balance
    }
  }

  // Get transactions for the current user
  function getTransactionsForUser() {
    return transactions.value.filter(transaction => transaction.email === userStore.email);
  }

  // Fetch transactions for the current user and update balance
  function fetchTransactions() {
    const userTransactions = getTransactionsForUser();
    transactions.value = userTransactions; // Update the transactions to only include the user's transactions
    balance.value = userTransactions.reduce((acc, transaction) => acc + transaction.amount, 0); // Update balance
  }

  return {
    transactions,
    balance,
    addTransaction,
    deleteTransaction,
    fetchTransactions,
  };
});
