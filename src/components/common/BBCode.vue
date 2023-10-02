<template>
    <div class="bbcode markdown" v-html="BBCodeService.parse(source)" />
</template>

<script lang="ts" setup>
import BBCodeService from '@/services/BBCodeService';

defineProps<{
    source: string
}>();
</script>
