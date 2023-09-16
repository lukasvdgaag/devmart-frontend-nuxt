<template>
    <label class="block font-medium text-sm text-gray-700 dark:text-gray-400">
      <template v-if="value">{{ value }}</template>
        <slot v-else/>
    </label>
</template>

<script lang="ts" setup>
defineProps<{
    value?: string
}>();
</script>
