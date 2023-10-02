<template>
    <Sidebar :margin="margin">
        <SidebarItem v-for="item in links" :key="item.link" :item="item" :links="links" />
    </Sidebar>
</template>

<script lang="ts" setup>
import Sidebar from '@/components/common/sidebar/Sidebar.vue';
import SidebarItem from '@/components/common/sidebar/SidebarItem.vue';
import SidebarItemModel from '@/models/components/SidebarItem.ts';

export interface Props {
    margin: boolean,
    links: SidebarItemModel[]
}

withDefaults(defineProps<Props>(), {
    margin: false,
    links: () => []
});
</script>

<style scoped>
</style>
