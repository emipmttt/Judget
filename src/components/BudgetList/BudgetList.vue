<template>
    <h2 class="text-1xl font-bold mb-4">{{ title }}</h2>
    <form @submit.prevent="handleAddItem" class="mb-4 flex items-center space-x-4">
        <input v-model="newItem.title" placeholder="Título" class="input input-bordered w-full max-w-xs" required />
        <input v-model.number="newItem.amount" placeholder="Monto" type="number"
            class="input input-bordered w-full max-w-xs" required />
        <button type="submit" class="btn btn-primary">Agregar gasto</button>
    </form>

    <ul>
        <li v-for="item in collection" :key="item.id">
            <div :class="{ 'card bg-base-300 shadow-xl p-5 mb-5': item.showProgress }">
                <div class="flex justify-between items-center rounded mb-4 space-x-4">
                    <input :value="item.title" @input="(e) => { updateItem({ ...item, title: e.target.value }) }"
                        placeholder="Título" class="input input-bordered w-full max-w-xs" />
                    <div class="flex items-center space-x-4">
                        <span v-if="allowProgress" class="font-bold">{{ getProgressTotal(item) }}</span>
                        <span v-if="allowProgress">/</span>
                        <input v-model.number="item.amount" placeholder="Monto" type="number"
                            class="input input-bordered w-full max-w-xs" />
                    </div>
                    <button v-if="item.id" @click="deleteItem(item.id)" class="btn btn-error">
                        <TrashIcon class="mr-2" /> Eliminar
                    </button>
                    <button v-if="allowProgress" @click="toggleItemProgress(item.id)" class="btn btn-secondary">
                        {{ item.showProgress ? 'Ocultar Progreso' : 'Mostrar Progreso' }}
                    </button>
                </div>

                <div v-if="allowProgress && item.showProgress">
                    <BudgetItemComponent :title="item.title + ' - Progreso'" :collection="item.progress || []"
                        :addItem="(newItem) => addProgressItem(item.id, newItem)"
                        :updateItem="(updatedItem) => updateProgressItem(item.id, updatedItem)"
                        :deleteItem="(progressItemId) => deleteProgressItem(item.id, progressItemId)"
                        :allowProgress="false" :showTotal="false" />
                </div>
            </div>
        </li>
    </ul>

    <div v-if="showTotal" class="text-right font-bold"> {{ title }} presupuestados : ${{ formatPrice(totalAmount) }}
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { BudgetItem } from "../../stores/storeUtilities";
import { TrashIcon } from "vue-tabler-icons";
import BudgetItemComponent from "./BudgetList.vue";

interface BudgetList {
    title: string;
    collection: BudgetItem[];
    addItem: (item: BudgetItem) => void;
    updateItem: (item: BudgetItem) => void;
    deleteItem: (id: number) => void;
    allowProgress: boolean
    showTotal: boolean
}

const { title, collection, addItem, updateItem, deleteItem, allowProgress, showTotal } = defineProps<BudgetList>();
const emit = defineEmits(['total-changed', 'progress-changed']);

const newItem = ref({ title: '', amount: 0 });

const handleAddItem = () => {
    addItem(newItem.value);
    newItem.value = { title: '', amount: 0 };
}

const totalAmount = computed(() => {
    return collection.reduce((sum, item) => sum + (item.amount || 0), 0);
});

const totalProgress = computed(() => {
    return collection.reduce((sum, item) => {
        return sum + (item.progress ? item.progress.reduce((pSum, pItem) => pSum + (pItem.amount || 0), 0) : 0);
    }, 0);
});

const formatPrice = (value) => {
    let val = ((value || 0) / 1).toFixed(2).replace('.', ',');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

watch(totalAmount, (newValue) => {
    emit('total-changed', newValue);
});

watch(totalProgress, (newValue) => {
    emit('progress-changed', newValue);
});

onMounted(() => {
    emit('total-changed', totalAmount.value);
    emit('progress-changed', totalProgress.value);
})

// Progress-related methods
const addProgressItem = (parentId: number, newItem: BudgetItem) => {
    const parentItem = collection.find(item => item.id === parentId);
    if (parentItem) {
        if (!parentItem.progress) {
            parentItem.progress = [];
        }
        parentItem.progress.push({ ...newItem, id: Date.now() });
        updateItem(parentItem);
        emit('progress-changed', totalProgress.value);
    }
};

const updateProgressItem = (parentId: number, updatedItem: BudgetItem) => {
    const parentItem = collection.find(item => item.id === parentId);
    if (parentItem && parentItem.progress) {
        const index = parentItem.progress.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
            parentItem.progress[index] = updatedItem;
            updateItem(parentItem);
            emit('progress-changed', totalProgress.value);
        }
    }
};

const deleteProgressItem = (parentId: number, progressItemId: number) => {
    const parentItem = collection.find(item => item.id === parentId);
    if (parentItem && parentItem.progress) {
        parentItem.progress = parentItem.progress.filter(item => item.id !== progressItemId);
        updateItem(parentItem);
        emit('progress-changed', totalProgress.value);
    }
};

const toggleItemProgress = (itemId: number) => {
    const item = collection.find(i => i.id === itemId);
    if (item) {
        updateItem({ ...item, showProgress: !item.showProgress });
    }
};

const getProgressTotal = (item: BudgetItem) => {
    if (item.progress && item.progress.length > 0) {
        return item.progress.reduce((sum, progressItem) => sum + (progressItem.amount || 0), 0);
    }
    return 0;
};
</script>