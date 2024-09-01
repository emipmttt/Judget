<script setup>
import { MenuIcon } from "vue-tabler-icons";
</script>
<template>
    <div className="navbar bg-base-100 lg:hidden">
        <div className="flex-none">
            <label for="my-drawer-2" class="btn btn-square drawer-button lg:hidden">
                <MenuIcon />
            </label>
        </div>
        <div className="flex-1">
            <a className="text-xl">Judget</a>
        </div>
        <div className="flex-none">
            <button className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    className="inline-block h-5 w-5 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z">
                    </path>
                </svg>
            </button>
        </div>
    </div>
</template>
