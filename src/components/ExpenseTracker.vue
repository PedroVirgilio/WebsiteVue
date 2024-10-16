<template>
  <div class="expense-tracker">
    <h4>Your Balance</h4>
    <p>Balance: ${{ transactionStore.balance }}</p>

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

    <h3>Add new transaction</h3>
    <form id="form" @submit.prevent="handleAddTransaction">
      <div class="form-control">
        <label for="text">Text</label>
        <input v-model="newTransactionDescription" placeholder="Description" required />
      </div>
      <div class="form-control">
        <label for="amount">Amount <br />(negative - expense, positive - income)</label>
        <input v-model.number="newTransactionAmount" placeholder="Amount" required />
      </div>
      <button type="submit">Add Transaction</button>
    </form>

    <h3>History</h3>
    <ul id="list" class="list">
      <li
        v-for="transaction in transactionStore.transactions" 
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

<script>
import { ref, computed, onMounted } from 'vue'; 
import { useTransactionStore } from '@/stores/transactionStore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const transactionStore = useTransactionStore();
    const newTransactionDescription = ref('');
    const newTransactionAmount = ref(0);
    const router = useRouter();

    const income = computed(() =>
      transactionStore.transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0)
    );

    const expenses = computed(() =>
      transactionStore.transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0)
    );

    const handleAddTransaction = () => {
      if (newTransactionDescription.value && newTransactionAmount.value) {
        transactionStore.addTransaction(newTransactionDescription.value, newTransactionAmount.value);
        newTransactionDescription.value = '';
        newTransactionAmount.value = 0;
        saveDataToLocalStorage(); // Save data after adding a transaction
      }
    };

    const deleteTransaction = (id) => {
      transactionStore.deleteTransaction(id);
      saveDataToLocalStorage(); // Save data after deleting a transaction
    };

    const goBack = () => {
      router.push('/'); 
    };

    // Load data from local storage
    const loadDataFromLocalStorage = () => {
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        transactionStore.transactions = JSON.parse(storedTransactions);
      }

      const storedBalance = localStorage.getItem('balance');
      if (storedBalance) {
        transactionStore.balance = JSON.parse(storedBalance);
      }
    };

    // Save data to local storage
    const saveDataToLocalStorage = () => {
      localStorage.setItem('transactions', JSON.stringify(transactionStore.transactions));
      localStorage.setItem('balance', JSON.stringify(transactionStore.balance));
    };

    // Fetch transactions when the component is mounted
    onMounted(() => {
      loadDataFromLocalStorage(); // Load data when component mounts
    });

    return {
      transactionStore,
      newTransactionDescription,
      newTransactionAmount,
      income,
      expenses,
      handleAddTransaction,
      deleteTransaction,
      goBack,
    };
  },
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
