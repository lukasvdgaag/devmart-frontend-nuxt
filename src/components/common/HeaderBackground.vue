<template>
    <div class="flex flex-col align-center relative top-[-80px] mb-[-80px] p-[6.25rem_1.5rem_4rem]
    bg-gradient-to-r from-indigo-600 to-purple-600
    w-full h-full left-0 min-h-[15rem] max-h-[16rem]">
        <div class="flex flex-col align-center">
            <div class="d-grid h-full">
                <div class="text-white col-span-12 text-center flex flex-col gap-2 align-center h-full">
                    <h1 class="text-white">{{ title }}</h1>
                    <p v-if="subtitle" class="text-white">{{ subtitle }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    title: string,
    subtitle?: string
}>();
</script>

<style scoped>
</style>
