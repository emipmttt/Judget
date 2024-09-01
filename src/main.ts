import './style.css'
import router from './router/router'
import './index.css'
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import useBudgetTemplateStore from './stores/budgetTemplateStore';
import { saveToLocalStorage } from './stores/storageUtils';
import useMonthExpensesStore from './stores/monthExpenses';

const pinia = createPinia();
const app = createApp(App);
app.use(router)
app.use(pinia)

const budgetTemplateStore = useBudgetTemplateStore()

budgetTemplateStore.loadStateFromLocalStorage()
budgetTemplateStore.$subscribe((_, state) => {
    saveToLocalStorage('budgetTemplate', state);
})

// Subscribe to store changes automatically
const monthExpensesStore = useMonthExpensesStore();

monthExpensesStore.loadStateFromLocalStorage();
monthExpensesStore.$subscribe((_, state) => {
    saveToLocalStorage('monthExpenses', state);
});


app.mount('#app');
