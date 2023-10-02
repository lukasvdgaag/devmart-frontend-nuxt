<script lang="ts" setup>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
    href: string,
    icon: string,
    text: string,
    smallIcon?: boolean,
    highlighted?: boolean
}>();

</script>

<template>
    <a
        :class="[highlighted ? 'bg-purple-600 dark:bg-purple-700 hover:bg-gray-600 text-white' :
            'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600']"
        :href="href"
        class="hover:bg-opacity-75 plain w-full lg:w-fit px-4 py-2 lg:px-4 lg:py-2 text-sm sm:text-base rounded-md flex align-center gap-2"
    >
        <font-awesome-icon :class="{'text-sm': smallIcon}" :icon="icon" />
        {{ text }}
    </a>
</template>
