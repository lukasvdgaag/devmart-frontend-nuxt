<template>
    <div
        :class="{ sticky: !fixed, fixed: fixed }"
        class="download-button-small bottom-0 left-0 w-full p-5 border-t border-t-gray-75 dark:border-t-gray-800 mt-6
              flex flex-col align-center bg-white dark:bg-gray-900"
    >
        <slot />
    </div>
</template>

<script lang="ts" setup>

export interface Props {
    fixed?: boolean
}

withDefaults(defineProps<Props>(), {
    fixed: false
});
</script>
