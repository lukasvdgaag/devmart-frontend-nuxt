<script lang="ts" setup>

import { Ref } from 'vue';
import Modal from '@/components/common/modal/Modal.vue';
import MutedText from '@/components/common/MutedText.vue';

export interface Props {
    id: string,
    title: string,
    description?: string,
    confirmationText?: string,
    cancelText?: string,
    dangerous?: boolean,
    show?: boolean,
}

const { show } = withDefaults(defineProps<Props>(), {
    confirmationText: 'Yes, I\'m sure',
    cancelText: 'No, cancel',
    dangerous: false,
    show: false
});

const modal: Ref<typeof Modal | undefined> = ref();

defineEmits(['submit', 'cancel']);

onMounted(() => {
    if (show) {
        modal.value?.flowbiteModal?.show();
    }
});

</script>

<template>
    <Modal
        :id="id"
        ref="modal"
        :cancel-text="cancelText"
        :confirm-text="confirmationText"
        :danger="dangerous"
        @cancel="$emit('cancel')"
        @click="$emit('cancel')"
        @submit="$emit('submit')"
    >
        <div class="text-center">
            <svg
                aria-hidden="true"
                class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
            <h3
                :class="[description ? 'mb-2' : 'mb-5']"
                class="text-lg font-normal text-gray-500 dark:text-gray-400"
            >
                {{ title }}
            </h3>
            <MutedText v-if="description" :html="description" class="text-sm" />
        </div>
    </Modal>
</template>
