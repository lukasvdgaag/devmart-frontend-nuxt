<template>
    <div class="flex flex-col justify-center items-center pt-6 sm:pt-0 flex-grow">
        <h1>{{ header }}</h1>
        <p>{{ subheader }}</p>

        <div class="w-full sm:max-w-md mt-3 px-6 py-4 bg-white dark:bg-gray-900 sm:rounded-lg">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>

export interface Props {
    header?: string,
    subheader?: string
}

withDefaults(defineProps<Props>(), {
    header: 'Login.',
    subheader: 'Hi, welcome back 👋'
});
</script>

<style scoped>
</style>
