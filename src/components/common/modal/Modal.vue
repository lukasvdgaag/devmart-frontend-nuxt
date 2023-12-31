<script lang="ts" setup>
import { Modal as FlowbiteModal } from 'flowbite';
import { Ref } from 'vue';
import CancellableEvent from '@/models/components/CancellableEvent.ts';

export interface Props {
    id: string,
    title?: string,
    description?: string,
    cancelButton?: boolean,
    cancelText?: string,
    danger?: boolean,
    confirmText?: string,
    disabled?: boolean
}

const { id } = withDefaults(defineProps<Props>(), {
    cancelButton: false,
    cancelText: 'Cancel',
    danger: false,
    confirmText: 'Confirm',
    disabled: false
});

const emit = defineEmits(['cancel', 'submit']);

const flowbiteModal: Ref<FlowbiteModal | undefined> = ref();
const modal: Ref<HTMLElement | undefined> = ref();

onMounted(() => {
    flowbiteModal.value = new FlowbiteModal(modal.value);

    document.querySelectorAll(`[data-modal-toggle='${id}']`).forEach((e) => {
        e.addEventListener('click', () => flowbiteModal.value?.toggle());
    });
    document.querySelectorAll(`[data-modal-hide='${id}']`).forEach((e) => {
        e.addEventListener('click', () => {
            if (flowbiteModal.value?.isVisible) {
                flowbiteModal.value?.hide();
            }
        });
    });
    document.querySelectorAll(`[data-modal-show='${id}']`).forEach((e) => {
        e.addEventListener('click', () => {
            if (flowbiteModal.value?.isHidden) {
                flowbiteModal.value?.show();
            }
        });
    });
});

const handleCancellableEvent = (eventName: 'cancel' | 'submit') => {
    const cancellable = new CancellableEvent();

    emit(eventName, cancellable);

    if (!cancellable.isCancelled()) {
        if (flowbiteModal.value?.isVisible) {
            flowbiteModal.value?.hide();
        }
    }
};

</script>

<template>
    <div
        :id="id"
        ref="modal"
        aria-hidden="true"
        class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        tabindex="-1"
        @click="$emit('cancel')"
    >
        <div class="relative w-full max-w-md max-h-full" @click.stop>
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                    :data-modal-hide="id"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                    type="button"
                    @click="$emit('cancel')"
                >
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            clip-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            fill-rule="evenodd"
                        />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <!-- Modal header -->
                <div v-if="title" class="px-6 py-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                        {{ title }}
                    </h3>
                </div>
                <!-- Modal body -->
                <div class="p-6">
                    <p v-if="description" class="text-sm" v-html="description" />

                    <slot />

                    <div class="mt-4 flex gap-2 justify-center items-center">
                        <button
                            v-if="danger"
                            :class="{'opacity-50 cursor-not-allowed': disabled}"
                            :data-modal-hide="id"
                            :disabled="disabled"
                            class="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium
                            rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                            type="button"
                            @click="handleCancellableEvent('submit')"
                        >
                            {{ confirmText }}
                        </button>
                        <button
                            v-if="cancelButton"
                            :data-modal-hide="id"
                            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200
                    rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500
                    dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                            type="button"
                            @click="handleCancellableEvent('cancel')"
                        >
                            {{ cancelText }}
                        </button>
                        <button
                            v-if="!danger"
                            :class="[disabled ? 'opacity-50' : 'hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800']"
                            :disabled="disabled"
                            class="text-white bg-primary-500 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                            type="button"
                            @click="handleCancellableEvent('submit')"
                        >
                            {{ confirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
