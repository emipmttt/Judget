import { createRouter, createWebHistory } from 'vue-router'
import BudgetTemplate from '../screens/BudgetTemplate/BudgetTemplate.vue'
import Calendar from '../screens/Calendar/Calendar.vue'

const routes = [
    { path: '/', component: BudgetTemplate },
    { path: '/plantilla-de-presupuesto', component: BudgetTemplate },
    { path: '/calendario', component: Calendar },
    { path: '/ahorros', component: BudgetTemplate },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router