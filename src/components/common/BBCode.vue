<template>
    <div class="bbcode markdown" v-html="bbCodeParser.parse(source)"></div>
</template>

<script lang="ts" setup>
import BBCodeParser from '@/services/BBCodeParser';
import {defineProps} from 'vue';

defineProps<{
    source: string
}>();

const bbCodeParser = new BBCodeParser();
</script>

<style scoped>
</style>
