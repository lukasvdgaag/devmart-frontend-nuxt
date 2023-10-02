<script lang="ts" setup>

import { Ref } from 'vue';
import DateService from '../../services/DateService.ts';
import SidebarHeader from '@/components/common/sidebar/SidebarHeader.vue';
import { Paste } from '@/models/paste/Paste.ts';
import PasteRepository from '@/services/repository/PasteRepository.ts';

// props
defineProps<{
    isCreatePage: boolean
}>();

// variables
const recentPastes: Ref<Paste[]> = ref([]);
const loading: Ref<boolean> = ref(true);

// methods
const fetchRecentPastes = async () => {
    loading.value = true;

    try {
        const response = await PasteRepository.fetchRecentPastes();
        recentPastes.value = response.pastes;
    } catch (e) {
        recentPastes.value = [];
    }

    loading.value = false;
};

// hooks
onMounted(() => {
    fetchRecentPastes();
});

</script>

<template>
    <div>
        <SidebarHeader>Recent Pastes</SidebarHeader>

        <div class="flex flex-col gap-3">
            <div v-if="loading" class="animate-pulse w-full mt-1" role="status">
                <template v-for="i in 5" :key="i">
                    <div class="h-3 bg-gray-300 rounded dark:bg-gray-600 w-32 mb-1" />
                    <div class="h-2.5 bg-gray-200 rounded dark:bg-gray-700 w-48 mb-4" />
                </template>
                <span class="sr-only">Loading...</span>
            </div>
            <NuxtLink
                v-for="paste in recentPastes"
                v-else
                :key="paste.id"
                :target="isCreatePage ? '_blank' : '_self'"
                :to="`/paste/${paste.name}`"
                class="plain"
            >
                <div class="text-sm font-semibold">
                    {{ paste.title }}
                </div>
                <div class="text-xs dark:text-gray-400">
                    {{ DateService.formatTimeAgo(new Date(paste.updated_at)) }} | by
                    {{ paste?.creator_username ?? 'anonymous' }}
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>

</style>
