<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold mr-4">Calendario</h1>
            <div class="flex">
                <button @click="toggleCollapseAll" class="btn btn-secondary mr-4">
                    <ToggleLeftIcon class="mr-2" /> {{ collapseAll ? 'Expandir meses' : 'Colapsar meses' }}
                </button>
                <button @click="addMonth" class="btn btn-primary">
                    <CalendarIcon class="mr-2" /> Agregar mes
                </button>
            </div>
        </div>
        <br>
        <ul>
            <li v-for="month in itemsStore.months" :key="month.id" class="flex mb-6">
                <div class="flex" style="width: 100px; margin-right: 20px;">
                    <h2 class="text-md font-bold mb-4">
                        {{ month.title }}
                        <br>
                        <button @click="toggleCollapse(month.id)" class=" btn btn-sm">
                            <ChevronDownIcon v-if="!isCollapsed(month.id)" />
                            <ChevronUpIcon v-else />
                        </button>
                    </h2>

                </div>
                <div v-show="!isCollapsed(month.id)">
                    <BudgetList title="Ingresos" :collection="month.earnings" :showTotal="true"
                        :addItem="(value) => addEarning(month.id, value)"
                        :updateItem="(e) => updateEarning(month.id, e.id, e)"
                        :deleteItem="(e) => deleteEarning(month.id, e)"
                        @total-changed="updateEarningTotal(month.id, $event)" />

                    <BudgetList title="Gastos" :collection="month.expenses" :allowProgress="true" :showTotal="true"
                        :addItem="(value) => addExpense(month.id, value)"
                        :updateItem="(e) => updateExpense(month.id, e.id, e)"
                        :deleteItem="(e) => deleteExpense(month.id, e)"
                        @total-changed="updateExpensesTotal(month.id, $event)"
                        @progress-changed="updateExpensesTotalProgress(month.id, $event)" />

                    <div class="text-right font-bold">Ahorro planeado: ${{ formatPrice(remainingAmount(month.id)) }}
                    </div>

                    <div class="text-right font-bold">Pagado: ${{ formatPrice(progressAmount(month.id)) }}</div>
                    <div class="text-right font-bold">Falta pagar: ${{ formatPrice(expensesAmount(month.id) -
                        progressAmount(month.id)) }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon, ToggleLeftIcon } from "vue-tabler-icons";
import { useMonthExpensesStore } from "../../stores/monthExpenses";
import { useBudgetTemplateStore } from "../../stores/budgetTemplateStore";
import BudgetList from "../../components/BudgetList/BudgetList.vue";

const itemsStore = useMonthExpensesStore();
const budgetTemplateStore = useBudgetTemplateStore();

const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const getCurrentMonthIndex = () => {
    const now = new Date();
    return now.getMonth();
};

const getCurrentYear = () => {
    const now = new Date();
    return now.getFullYear();
};

const months = ref([]);
const currentMonthIndex = ref(getCurrentMonthIndex());
const currentYear = ref(getCurrentYear());

const earningTotals = ref({});
const expensesTotals = ref({});
const expensesProgressTotals = ref({});

const collapsedMonths = ref({});
const collapseAll = ref(false);

const toggleCollapse = (monthId) => {
    collapsedMonths.value = { ...collapsedMonths.value, [monthId]: !collapsedMonths.value[monthId] };
};

const toggleCollapseAll = () => {
    collapseAll.value = !collapseAll.value;
    itemsStore.months.forEach(month => {
        collapsedMonths.value = { ...collapsedMonths.value, [month.id]: collapseAll.value };
    });
};

const isCollapsed = (monthId) => collapsedMonths.value[monthId] || false;

const addMonth = () => {
    let nextMonthIndex = currentMonthIndex.value;
    let nextYear = currentYear.value;
    let newMonthTitle = `${monthNames[nextMonthIndex]} ${nextYear}`;

    while (itemsStore.months.some(month => month.title === newMonthTitle)) {
        nextMonthIndex = (nextMonthIndex + 1) % 12;
        if (nextMonthIndex === 0) {
            nextYear += 1;
        }
        newMonthTitle = `${monthNames[nextMonthIndex]} ${nextYear}`;
    }

    const id = Date.now();

    const newMonth = {
        id,
        title: newMonthTitle,
        expenses: budgetTemplateStore.expenses.map(item => ({
            ...item, children: {
                newExpense: { title: '', amount: 0 },
                expenses: []
            }
        })),
        earnings: budgetTemplateStore.earnings.map(item => ({
            ...item, children: {
                newEarning: { title: '', amount: 0 },
                expenses: []
            }
        })),
    };

    itemsStore.addMonth(newMonth);

    currentMonthIndex.value = nextMonthIndex;
    currentYear.value = nextYear;
};

const addEarning = (monthId, value) => {
    const month = itemsStore.months.find(month => month.id === monthId);
    if (month) {
        const id = Date.now();
        month.earnings.push({ ...value, id });
        month.newEarning = { title: '', amount: 0 };

        itemsStore.updateMonth(monthId, month);
    }
};

const updateEarning = (monthId, earningId, value) => {
    const month = itemsStore.months.find(month => month.id === monthId);
    if (month) {
        const earningIndex = month.earnings.findIndex(earning => earning.id === earningId);
        if (earningIndex !== -1) {
            month.earnings[earningIndex] = { ...month.earnings[earningIndex], ...value };
            month.newEarning = { title: '', amount: 0 };

            itemsStore.updateMonth(monthId, month);
        } else {
            console.error(`Earning with id ${earningId} not found in month ${monthId}.`);
        }
    } else {
        console.error(`Month with id ${monthId} not found.`);
    }
};

const deleteEarning = (monthId, earningId) => {
    const month = itemsStore.months.find(month => month.id === monthId);
    if (month) {
        const earningIndex = month.earnings.findIndex(earning => earning.id === earningId);
        if (earningIndex !== -1) {
            month.earnings.splice(earningIndex, 1);
            itemsStore.updateMonth(monthId, month);
        } else {
            console.error(`Earning with id ${earningId} not found in month ${monthId}.`);
        }
    } else {
        console.error(`Month with id ${monthId} not found.`);
    }
};

const addExpense = (monthId, value) => {
    const month = itemsStore.months.find(month => month.id === monthId);
    if (month) {
        const id = Date.now();
        month.expenses.push({ ...value, id });
        month.newExpense = { title: '', amount: 0 };

        itemsStore.updateMonth(monthId, month);
    }
};

const updateExpense = (monthId, expenseId, value) => {
    const month = itemsStore.months.find(month => month.id === monthId);
    if (month) {
        const expenseIndex = month.expenses.findIndex(expense => expense.id === expenseId);
        if (expenseIndex !== -1) {
            month.expenses[expenseIndex] = { ...month.expenses[expenseIndex], ...value };
            month.newExpense = { title: '', amount: 0 };

            itemsStore.updateMonth(monthId, month);
        } else {
            console.error(`Expense with id ${expenseId} not found in month ${monthId}.`);
        }
    } else {
        console.error(`Month with id ${monthId} not found.`);
    }
};

const deleteExpense = (monthId, expenseId) => {
    const month = itemsStore.months.find(month => month.id === monthId);
    if (month) {
        const expenseIndex = month.expenses.findIndex(expense => expense.id === expenseId);
        if (expenseIndex !== -1) {
            month.expenses.splice(expenseIndex, 1);
            itemsStore.updateMonth(monthId, month);
        } else {
            console.error(`Expense with id ${expenseId} not found in month ${monthId}.`);
        }
    } else {
        console.error(`Month with id ${monthId} not found.`);
    }
};

const updateEarningTotal = (monthId, total) => {
    earningTotals.value = { ...earningTotals.value, [monthId]: total };
};

const updateExpensesTotal = (monthId, total) => {
    expensesTotals.value = { ...expensesTotals.value, [monthId]: total };
};

const updateExpensesTotalProgress = (monthId, total) => {
    expensesProgressTotals.value = { ...expensesProgressTotals.value, [monthId]: total };
};

const remainingAmount = (monthId) => {
    const earnings = earningTotals.value[monthId] || 0;
    const expenses = expensesTotals.value[monthId] || 0;
    return earnings - expenses;
};

const progressAmount = (monthId) => {
    return expensesProgressTotals.value[monthId] || 0;
};

const expensesAmount = (monthId) => {
    return expensesTotals.value[monthId] || 0;
};

const formatPrice = (amount) => {
    return new Intl.NumberFormat("es-MX").format(amount);
};
</script>