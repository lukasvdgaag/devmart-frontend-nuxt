<script lang="ts" setup>
export interface Props {
    page: number | string,
    active?: boolean,
    disabled?: boolean,
    rounded?: boolean,
}

const {
    disabled,
    page
} = withDefaults(defineProps<Props>(), {
    active: false,
    disabled: false,
    rounded: false
});

const emit = defineEmits(['update']);

const query = computed(() => {
    const query = useRoute().query;
    if (!disabled && typeof page === 'number') {
        query.page = page;
    }
    return query;
});

const handleClick = () => {
    if (!disabled) {
        emit('update', page);
    }
};

</script>

<template>
    <NuxtLink
        :class="{
            'focus:z-20': disabled,
            'z-1 border-indigo-500 bg-indigo-50 text-indigo-600': active,
            'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300': !active,
            'hover:bg-gray-50 hover:dark:bg-gray-700': !disabled && !active,
            'cursor-pointer': !disabled,
            'rounded-md': $slots.default && rounded,
        }"
        :to="{query}"
        class="relative inline-flex items-center border px-4 py-2 text-sm font-medium plain"
        @click.prevent="handleClick"
    >
        <slot v-if="$slots.default" />
        <template v-else>
            {{ page }}
        </template>
    </NuxtLink>
</template>

<style scoped>

</style>
