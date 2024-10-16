import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);
  const balance = ref(0); // Initialize balance

  // Load transactions from local storage
  function loadTransactionsFromLocalStorage(userEmail) {
    const storedTransactions = localStorage.getItem(`transactions-${userEmail}`);
    if (storedTransactions) {
      transactions.value = JSON.parse(storedTransactions);
      updateBalance();
    } else {
      transactions.value = []; // Initialize as empty if none exist
    }
  }

  // Save transactions to local storage
  function saveTransactionsToLocalStorage(userEmail) {
    localStorage.setItem(`transactions-${userEmail}`, JSON.stringify(transactions.value));
  }

  // Update balance based on transactions
  function updateBalance() {
    balance.value = transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0);
  }

  // Add a new transaction
  function addTransaction(description, amount, userEmail) {
    const transaction = {
      id: Date.now(), // or any unique identifier
      text: description,
      amount,
      user: userEmail, // Associate the transaction with the user's email
    };
    transactions.value.push(transaction);
    saveTransactionsToLocalStorage(userEmail); // Save to local storage
    updateBalance(); // Update balance after adding a transaction
  }

  // Delete a transaction
  function deleteTransaction(id, userEmail) {
    const transactionIndex = transactions.value.findIndex((t) => t.id === id);
    if (transactionIndex !== -1) {
      transactions.value.splice(transactionIndex, 1);
      saveTransactionsToLocalStorage(userEmail); // Save to local storage
      updateBalance(); // Update balance after deleting a transaction
    }
  }

  return {
    transactions,
    balance,
    loadTransactionsFromLocalStorage,
    saveTransactionsToLocalStorage,
    addTransaction,
    deleteTransaction,
  };
});
