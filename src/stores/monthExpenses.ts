import { defineStore } from "pinia";
import { getFromLocalStorage } from './storageUtils'; // Reuse the existing utility functions

export const useMonthExpensesStore = defineStore('monthExpenses', {
    state: () => {
        return { 
            months: [] as { id: number, [key: string]: any }[] 
        };
    },
    actions: {
        addMonth(item) {
            this.months.push({ id: Date.now(), ...item });
        },
        updateMonth(id, item) {
            const index = this.months.findIndex((month) => month.id === id);
            this.months[index] = { id, ...item }; // Ensure the id is preserved
        },
        deleteMonth(id) {
            this.months = this.months.filter(item => item.id !== id);
        },

        // Load state from localStorage if available
        loadStateFromLocalStorage() {
            const storedState = getFromLocalStorage('monthExpenses');
            if (storedState) {
                this.$patch(storedState);
            }
        }
    },
});

export default useMonthExpensesStore;
