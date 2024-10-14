import { defineStore } from 'pinia';
import { db } from '@/firebase'; // Your firebase setup
import { ref } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);

  const fetchTransactions = async (userId) => {
    const snapshot = await db.collection('users').doc(userId).collection('transactions').get();
    transactions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const addTransaction = async (userId, transaction) => {
    await db.collection('users').doc(userId).collection('transactions').add(transaction);
    transactions.value.push(transaction);
  };

  const deleteTransaction = async (userId, transactionId) => {
    await db.collection('users').doc(userId).collection('transactions').doc(transactionId).delete();
    transactions.value = transactions.value.filter(t => t.id !== transactionId);
  };

  return {
    transactions,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
  };
});
