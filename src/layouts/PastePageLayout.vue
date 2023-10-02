<script lang="ts" setup>

import Navbar from '@/components/common/navbar/Navbar.vue';
import HeaderBackground from '@/components/common/HeaderBackground.vue';
import Sidebar from '@/components/common/sidebar/Sidebar.vue';
import SidebarItem from '@/components/common/sidebar/SidebarItem.vue';
import SidebarItemModel from '@/models/components/SidebarItem.ts';
import { useAuth } from '@/store/authStore.ts';
import RecentPastesList from '@/components/paste/RecentPastesList.vue';

defineProps<{
    isCreatePage: boolean
}>();
</script>

<template>
    <div class="w-full flex flex-col items-center m-0 p-0 relative h-full">
        <Navbar :background="false" />

        <HeaderBackground subtitle="Easily share text." title="Paste" />

        <div class="d-grid !px-4 mt-6 h-full">
            <Sidebar :left-side="true" :margin="false" class="mb-4 lg:mb-2 lg:row-start-1">
                <SidebarItem
                    :item="new SidebarItemModel('/paste', 'plus', 'Create new paste')"
                    :margin-right="false"
                    :target="isCreatePage ? '_blank' : '_self'"
                />
                <SidebarItem
                    v-if="useAuth().loggedIn"
                    :item="new SidebarItemModel({name: 'accountPastes'}, 'fa-paste', 'Your pastes', true, false, false)"
                    :links="[]"
                    :margin-right="false"
                    :target="isCreatePage ? '_blank' : '_self'"
                    highlight
                />
                <hr class="hidden lg:block">

                <RecentPastesList :is-create-page="isCreatePage" class="hidden lg:block" />
            </Sidebar>
            <div class="col-span-12 lg:col-span-9 flex">
                <slot />
            </div>
        </div>
    </div>
</template>
