<template>
    <div
        :id="id"
        :class="{'md:min-w-60 md:w-fit': !fullWidth}"
        class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg drop-shadow-md dark:bg-gray-700 dark:divide-gray-600 absolute top-full left-0
              w-[calc(100%-1.5rem)] border border-gray-200 dark:border-gray-600"
    >
        <div v-if="(header && header.length > 0) || (description && description.length > 0)" class="px-4 py-3">
            <div v-if="header && header.length > 0" class="text-md font-medium dark:text-gray-200">
                {{ header }}
            </div>
            <p v-if="description && description.length > 0" class="border-none dark:text-gray-400 leading-tight">
                {{ description }}
            </p>
        </div>

        <slot />
    </div>
</template>

<script lang="ts" setup>

export interface Props {
    id: string,
    header?: string,
    description?: string,
    fullWidth?: boolean
}

const {
    id,
    header,
    description,
    fullWidth
} = withDefaults(defineProps<Props>(), {
    header: '',
    description: ''
});
</script>

<style scoped>
</style>
