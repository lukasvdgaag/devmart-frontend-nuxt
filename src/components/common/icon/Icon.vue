<script lang="ts" setup>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export interface Props {
    src: string,
    isFontAwesome?: boolean
}

withDefaults(defineProps<Props>(), {
    isFontAwesome: false
});

</script>

<template>
    <div class="min-w-10 min-h-10 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 flex align-center hover:bg-gray-200">
        <font-awesome-icon v-if="isFontAwesome" :icon="src" class="text-lg" />
        <img v-else :src="src" alt="Highlight icon" class="w-5 rounded">
    </div>
</template>

<style scoped>

</style>
