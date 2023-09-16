<script lang="ts" setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export interface Props {
    type?: string,
    icon: string,
    label: string,
    background?: boolean,
    to?: boolean
}

withDefaults(defineProps<Props>(), {
    type: 'button',
    background: false,
});
</script>

<template>
    <button
        v-if="type === 'button'"
        :class="[background ? 'navbar-popup-item-nobg': 'navbar-popup-item-bg']"
        class="navbar-popup-item"
        type="button">
        <font-awesome-icon :icon="icon" class="text-xs min-w-3"/>
        <span>{{ label }}</span>
    </button>
    <NuxtLink v-else :class="[background ? 'navbar-popup-item-nobg': 'navbar-popup-item-bg']" :to="to" class="navbar-popup-item plain">
        <font-awesome-icon :icon="icon" class="text-xs min-w-3"/>
        <span>{{ label }}</span>
    </NuxtLink>
</template>

<style scoped>
.navbar-popup-item {
    @apply px-4 py-2 w-full rounded-none text-sm flex flex-row items-center gap-2;
}

.navbar-popup-item-bg {
    @apply text-gray-700 hover:bg-gray-100;
}

.navbar-popup-item-nobg {
    @apply text-gray-200 dark:text-gray-800 dark:hover:text-black dark:hover:bg-gray-100 hover:text-white hover:bg-gray-600;
}
</style>