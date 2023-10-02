<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export interface Props {
    icon?: string,
    type?: string,
    closable?: boolean
}

const {
    type,
    closable
} = withDefaults(defineProps<Props>(), {
    type: 'info',
    closable: true
});

defineEmits(['close']);

const closed = ref(false);

const classes = computed(() => {
    switch (type) {
    case 'success':
        return ['bg-green-100 dark:bg-green-900 dark:text-green-400 text-green-800'];
    case 'error':
        return ['bg-red-100 dark:bg-red-900 dark:text-red-400 text-red-800'];
    case 'warning':
        return ['bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400 text-yellow-800'];
    default:
        return ['bg-primary-100 dark:bg-primary-900 dark:text-primary-400 text-primary-800'];
    }
});
</script>

<template>
    <div
        :class="[classes, {'hidden': closed}]"
        class="flex items-center gap-4 rounded-lg px-4 pr-10 py-3 dark:bg-gray-800 relative"
    >
        <div class="absolute h-full top-0 right-4 flex items-center">
            <font-awesome-icon
                v-if="closable"
                class="cursor-pointer"
                icon="xmark"
                size="lg"
                @click="closed = true; $emit('close')"
            />
        </div>
        <font-awesome-icon v-if="icon" :icon="icon" size="2xl" />
        <slot />
    </div>
</template>
