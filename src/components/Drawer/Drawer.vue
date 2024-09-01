<script setup>
import { RouterLink, RouterView } from "vue-router"
import Header from "./Header/Header.vue"
import { CalendarDollarIcon, CalendarIcon } from "vue-tabler-icons";

</script>
<template>
    <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col items-center justify-center">
            <Header />
            <RouterView />
        </div>
        <div class="drawer-side">
            <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
            <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                <!-- Sidebar content here -->
                <a className="text-xl">Judget</a>
                <br>
                <li>
                    <RouterLink to="/calendario">
                        <CalendarIcon /> Calendario
                    </RouterLink>
                </li>
                <!-- <li>
                    <RouterLink to="/ahorros">
                        <CalendarDollarIcon /> Ahorros
                    </RouterLink>
                </li> -->
                <li>
                    <RouterLink to="/plantilla-de-presupuesto">
                        <CalendarDollarIcon /> Plantilla de prespuesto
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>