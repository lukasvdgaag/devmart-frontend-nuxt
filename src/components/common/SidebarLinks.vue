<template>
    <Sidebar :margin="margin">
        <SidebarItem v-for="item in links" :key="item.id" :item="item" :links="links"/>
    </Sidebar>
</template>

<script lang="ts" setup>
import Sidebar from '@/components/Common/Sidebar.vue';
import SidebarItem from '@/components/Common/SidebarItem.vue';
import {defineProps} from 'vue';

export interface Props {
    margin: boolean,
    links: Array
}

withDefaults(defineProps<Props>(), {
    margin: false,
    links: []
});
</script>

<style scoped>
</style>
