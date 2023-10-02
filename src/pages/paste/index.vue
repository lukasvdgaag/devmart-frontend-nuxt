<script lang="ts" setup>

import PasteEditStructure from '@/components/paste/PasteEditStructure.vue';

definePageMeta({
    middleware: ['paste-access']
});
</script>

<template>
    <PasteEditStructure :is-create-page="true" :paste-id="$route.params.pasteId" />
</template>
