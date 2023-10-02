<script lang="ts" setup>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Ref } from 'vue';
import { useAsyncData } from 'nuxt/app';
import Stats from '@/components/common/Stats.vue';
import Stat from '@/components/common/Stat.vue';
import PasteActionLink from '@/components/paste/PasteActionLink.vue';
import CodeHighlightBlock from '@/components/common/code/CodeHighlightBlock.vue';
import StickyFooter from '@/components/common/StickyFooter.vue';
import PasteRepository from '@/services/repository/PasteRepository.ts';
import DateService from '@/services/DateService.ts';

// props
const pasteId: string = useRoute().params.pasteId;
const sharing: Ref<boolean> = ref(false);
const codeHighlightBlock: Ref<typeof CodeHighlightBlock | undefined> = ref();

const {
    data: paste,
    pending: loading,
    refresh: refetchPaste
} = await useAsyncData('paste', async () => {
    return await PasteRepository.fetchPaste(pasteId);
});

const share = () => {
    if (sharing.value) {
        return;
    }
    sharing.value = true;

    navigator.clipboard.writeText(window.location.href);

    setTimeout(() => {
        sharing.value = false;
    }, 2500);
};

// computed
const formattedUpdatedAt = computed(() => {
    if (!paste.value?.updated_at) {
        return null;
    }
    return DateService.formatDateRelatively(new Date(paste.value?.updated_at), true);
});
const shareIcons = computed(() => {
    return sharing.value ? 'fa-solid fa-clipboard' : 'fa-solid fa-share-nodes';
});
const shareText = computed(() => {
    return sharing.value ? 'Copied Link!' : 'Share';
});
const pasteTitle = computed(() => {
    return paste.value?.title ?? 'Unknown Paste';
});

watch(() => pasteId, () => {
    refetchPaste();
    codeHighlightBlock.value?.highlight();
});

definePageMeta({
    middleware: ['paste-access']
});

</script>

<template>
    <div>
        <Title>{{ pasteTitle }} - Paste</Title>

        <NuxtLayout :is-create-page="false" name="paste-page-layout">
            <div v-if="loading" class="animate-pulse w-full" role="status">
                <div class="h-10 bg-gray-200 rounded dark:bg-gray-700 w-1/2 mb-2" />
                <div class="h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-60 mb-6" />

                <div class="h-40 bg-gray-200 rounded dark:bg-gray-700 w-full " />
                <span class="sr-only">Loading...</span>
            </div>
            <div v-else-if="paste" class="flex flex-col w-full">
                <h2>{{ paste.title }}</h2>
                <Stats>
                    <Stat>By {{ paste.creator_username ?? 'anonymous' }}</Stat>
                    <Stat>{{ formattedUpdatedAt }}</Stat>
                    <Stat v-if="paste.style && paste.style !== 'none'">
                        {{ paste.style == 'less' ? 'Error' : paste.style }}
                    </Stat>
                </Stats>

                <div class="mt-4 mb-12 flex-grow">
                    <div class="flex gap-2 justify-end font-semibold">
                        <PasteActionLink :href="`/paste/${pasteId}/download`" icon="fa-solid fa-download" small-icon target="_blank" text="Download" />
                        <PasteActionLink :href="`/paste/${pasteId}/raw`" icon="fa-solid fa-align-left" small-icon text="Raw" />
                        <PasteActionLink :href="`/paste/${pasteId}/edit`" highlighted icon="fa-solid fa-pen" small-icon text="Edit" />

                        <button class="primary w-fit px-4 py-2 rounded-md align-center gap-2 hidden lg:flex" @click="share">
                            <font-awesome-icon :icon="shareIcons" />
                            {{ shareText }}
                        </button>
                    </div>

                    <CodeHighlightBlock
                        v-if="paste?.content"
                        ref="codeHighlightBlock"
                        :code="paste.content ?? ''"
                        :language="paste.style"
                        class="mt-2 h-full lg:h-fit"
                    />
                </div>

                <StickyFooter class="lg:hidden">
                    <button class="primary w-full p-2 mt-0 rounded-md flex align-center gap-2" @click="share">
                        <font-awesome-icon :icon="shareIcons" />
                        {{ shareText }}
                    </button>
                </StickyFooter>
            </div>
        </NuxtLayout>
    </div>
</template>

<style scoped>
.hljs {
    @apply !bg-gray-100 rounded-lg;
}
</style>
