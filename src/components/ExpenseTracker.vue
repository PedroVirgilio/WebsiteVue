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
        v-for="transaction in userTransactions" 
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
import { useUserStore } from '@/stores/userStore'; // Assuming you have a user store

export default {
  setup() {
    const transactionStore = useTransactionStore();
    const userStore = useUserStore(); // Get the user store to access the current user
    const newTransactionDescription = ref('');
    const newTransactionAmount = ref(0);
    const router = useRouter();

    const userEmail = computed(() => userStore.email); // Get the logged-in user's email

    const userTransactions = computed(() => 
      transactionStore.transactions.filter(transaction => transaction.user === userEmail.value)
    );

    const income = computed(() => 
      userTransactions.value
        .filter(transaction => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0)
    );

    const expenses = computed(() => 
      userTransactions.value
        .filter(transaction => transaction.amount < 0)
        .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0)
    );

    const handleAddTransaction = () => {
      if (newTransactionDescription.value && newTransactionAmount.value) {
        transactionStore.addTransaction(newTransactionDescription.value, newTransactionAmount.value, userEmail.value);
        newTransactionDescription.value = '';
        newTransactionAmount.value = 0;
      }
    };

    const deleteTransaction = (id) => {
      transactionStore.deleteTransaction(id, userEmail.value);
    };

    const goBack = () => {
      router.push('/'); 
    };

    // Fetch transactions when the component is mounted
    onMounted(() => {
      transactionStore.loadTransactionsFromLocalStorage(userEmail.value);
    });

    return {
      transactionStore,
      newTransactionDescription,
      newTransactionAmount,
      income,
      expenses,
      userTransactions,
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
