<script lang="ts" setup>
import { FormErrors } from '@/interfaces/FormErrors.ts';

defineProps<{
    errors: FormErrors,
    item: string,
}>();

</script>

<template>
    <div v-if="item in errors" class="text-red-400 text-md mt-1">
        {{ errors[item][0] }}
    </div>
</template>

<style scoped>

</style>
