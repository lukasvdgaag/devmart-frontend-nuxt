<template>
    <div v-if="dot" class="rounded-full w-2 h-2 mr-2 flex-shrink-0 bg-gray-300 dark:bg-gray-700"></div>
    <div :class="{'text-sm mr-2': small, 'text-base mr-4': !small}" class="font-semibold text-gray-500 dark:text-gray-400">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import {defineProps} from 'vue';

export interface Props {
    dot: boolean,
    small: boolean
}

withDefaults(defineProps<Props>(), {
    dot: true,
    small: false,
});
</script>
