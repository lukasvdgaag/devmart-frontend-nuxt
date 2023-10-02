<template>
    <Input :value="$slots.default()[0].children" class="w-fit mt-1" disabled />
</template>

<script lang="ts" setup>
import Input from '@/components/Common/Form/Input.vue';
</script>
