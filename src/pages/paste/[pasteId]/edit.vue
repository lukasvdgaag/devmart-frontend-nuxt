<script lang="ts" setup>

import Index from "@/pages/paste/index.vue";
</script>

<template>
    <index :is-create-page="false" :paste-id="$route.params.pasteId"/>
</template>

<style scoped>

</style>