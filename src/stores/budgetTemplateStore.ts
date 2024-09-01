import { defineStore } from 'pinia';
import { BudgetItem, deleteItem, addItem, updateItem } from './storeUtilities';
import { getFromLocalStorage } from './storageUtils';

export const useBudgetTemplateStore = defineStore('budgetTemplate', {
    state: () => ({
        earnings: [] as BudgetItem[],
        expenses: [] as BudgetItem[],
    }),
    actions: {
        addExpense(item: BudgetItem) {
            addItem<BudgetItem>(this.expenses, item);
        },
        updateExpense(item: BudgetItem) {
            updateItem<BudgetItem>(this.expenses, item.id!, item);
        },
        deleteExpense(id: number) {
            deleteItem<BudgetItem>(this.expenses, id);
        },
        addEarning(item: BudgetItem) {
            addItem<BudgetItem>(this.earnings, item);
        },
        updateEarning(item: BudgetItem) {
            updateItem<BudgetItem>(this.earnings, item.id!, item);
        },
        deleteEarning(id: number) {
            deleteItem<BudgetItem>(this.earnings, id);
        },

        // Load state from localStorage if available
        loadStateFromLocalStorage() {
            const storedState = getFromLocalStorage('budgetTemplate');
            if (storedState) {
                this.$patch(storedState);
            }
        }
    },
});

export default useBudgetTemplateStore