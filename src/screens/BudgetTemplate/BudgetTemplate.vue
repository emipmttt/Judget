<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Plantilla de presupuesto</h1>
        <br>

        <BudgetList title="Ingresos" :collection="budgetTemplateStore.earnings" :addItem="addEarning"
            :updateItem="updateEarning" :deleteItem="deleteEarning" :showTotal="true" />

        <BudgetList title="Gastos" :collection="budgetTemplateStore.expenses" :addItem="addExpense"
            :updateItem="updateExpense" :deleteItem="deleteExpense" :showTotal="true" />

    </div>
</template>

<script setup>
import { useBudgetTemplateStore } from "../../stores/budgetTemplateStore.ts"
import BudgetList from "../../components/BudgetList/BudgetList.vue"
import { saveToLocalStorage } from "../../stores/storageUtils.ts";

const budgetTemplateStore = useBudgetTemplateStore()

// Earnings

const addEarning = ({ title, amount }) => {
    budgetTemplateStore.addEarning({ title, amount })
};

const updateEarning = (item) => {
    budgetTemplateStore.updateEarning(item)
}

const deleteEarning = (id) => {
    budgetTemplateStore.deleteEarning(id)
};

// Expenses

const addExpense = ({ title, amount }) => {
    budgetTemplateStore.addExpense({ title, amount })
};

const updateExpense = (item) => {
    budgetTemplateStore.updateExpense(item)
}

const deleteExpense = (id) => {
    budgetTemplateStore.deleteExpense(id)
};


</script>

<style scoped>
/* You can add additional styles if needed */
</style>