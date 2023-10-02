<script lang="ts" setup>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Ref } from 'vue';
import { initDropdowns, initModals } from 'flowbite';
import { useAsyncData } from 'nuxt/app';
import Input from '@/components/common/form/Input.vue';
import ValidationError from '@/components/common/form/ValidationError.vue';
import DropdownSelect from '@/components/common/form/DropdownSelect.vue';
import Label from '@/components/common/form/Label.vue';
import StickyFooter from '@/components/common/StickyFooter.vue';
import ConfirmationModal from '@/components/common/modal/ConfirmationModal.vue';
import { Paste } from '@/models/paste/Paste.ts';
import { PasteVisibility } from '@/models/paste/PasteVisibility.ts';
import { PasteStyle } from '@/models/paste/PasteStyle.ts';
import { FormErrors } from '@/interfaces/FormErrors.ts';
import DropdownSelectItem from '@/models/components/DropdownSelectItem.ts';
import { PasteCreateBody } from '@/models/rest/paste/PasteCreateBody.ts';
import PasteRepository from '@/services/repository/PasteRepository.ts';
import { pasteLifetimeSelectItems, pasteStyleSelectItems, pasteVisibilitySelectItems } from '@/constants/dropdown-select-item-constants.ts';

// props
const {
    pasteId,
    isCreatePage
} = defineProps<{
    pasteId?: string,
    isCreatePage?: boolean
}>();

// data variables
const fullScreenBtnRight = ref('0.5rem');
const fullScreen = ref(false);
const loading = ref(false);
const content: Ref<HTMLElement | undefined> = ref();
const selectedLifetime: Ref<DropdownSelectItem | undefined> = ref();
const selectedVisibility: Ref<DropdownSelectItem | undefined> = ref();
const selectedStyle: Ref<DropdownSelectItem | undefined> = ref();
const errors: Ref<FormErrors> = ref({});

// methods
const onContentScroll = () => {
    if ((content.value?.scrollHeight as number) >= (content.value?.clientHeight as number)) {
        const scrollBarWidth = (content.value?.offsetWidth as number) - (content.value?.clientWidth as number);
        fullScreenBtnRight.value = 'calc(0.5rem + ' + scrollBarWidth + 'px)';
    } else {
        fullScreenBtnRight.value = '0.5rem';
    }
};

const {
    data: paste,
    refresh: refetchPaste
} = await useAsyncData('paste', async (): Promise<Paste> => {
    const pasteId = useRoute().params.pasteId;
    if (!pasteId) {
        return {} as Paste;
    }

    try {
        const paste = await PasteRepository.fetchPaste(pasteId);
        if (!paste) {
            return {} as Paste;
        }

        selectedVisibility.value = pasteVisibilitySelectItems.find(item => item.value === paste.visibility);
        selectedLifetime.value = pasteLifetimeSelectItems.find(item => item.value === paste.lifetime);
        selectedStyle.value = pasteStyleSelectItems.find(item => item.value === paste.style);
        setTimeout(onContentScroll, 10);
        return paste;
    } catch (e) {
        return {} as Paste;
    }
});

const checkForErrors = (): boolean => {
    errors.value = {};

    if (!paste.value?.content || paste.value?.content?.length === 0) {
        errors.value.content = ['The content field is required.'];
    }

    return Object.keys(errors.value)?.length === 0;
};

const uploadPaste = async () => {
    if (loading.value || !paste.value) {
        return;
    }

    loading.value = true;
    if (!checkForErrors()) {
        loading.value = false;
        return;
    }

    const body: PasteCreateBody = {
        title: paste.value.title,
        style: PasteStyle[selectedStyle?.value?.value as keyof typeof PasteStyle],
        visibility: PasteVisibility[selectedVisibility?.value?.value as keyof typeof PasteVisibility],
        lifetime: selectedLifetime?.value?.value as string | undefined,
        content: paste.value.content as string
    };

    try {
        // updating when editing, creating new otherwise.
        const res = pasteId ? await PasteRepository.updatePaste(pasteId, body) : await PasteRepository.createPaste(body);
        errors.value = {};
        if (res) {
            useRouter().push(`/paste/${res.name}`);
        }
    } catch (e: any) {
        console.error(e);
        errors.value = e.response.data.errors;
    } finally {
        loading.value = false;
    }
};

const deletePaste = async () => {
    if (loading.value) {
        return;
    }

    loading.value = true;
    try {
        if (await PasteRepository.deletePaste(pasteId as string)) {
            paste.value = {} as Paste;
            useRouter().push({ name: 'paste' });
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const toggleFullScreen = () => {
    fullScreen.value = !fullScreen.value;
    setTimeout(onContentScroll, 10);
};

// computed
const contentStyling = computed(() => {
    return {
        right: fullScreenBtnRight.value
    };
});

// hooks
onMounted(() => {
    initDropdowns();
    initModals();
});

watch(() => paste.value?.content, onContentScroll);
watch(() => useRoute().params.pasteId, () => {
    refetchPaste();
});
</script>

<template>
    <div class="h-full">
        <NuxtLayout :is-create-page="isCreatePage ?? true" name="paste-page-layout">
            <div v-if="paste" class="flex flex-col gap-2 w-full h-full">
                <h2 class="dark:text-gray-100 text-3xl mb-4 mt-1">
                    {{ pasteId ? 'Edit your Paste' : 'Create a new Paste' }}
                </h2>

                <form class="h-full">
                    <div class="flex flex-col gap-1">
                        <Label class="text-md">Title</Label>
                        <Input
                            v-model="paste.title"
                            :errors="errors"
                            class="w-full px-4 text-base"
                            item="title"
                            maxlength="50"
                            placeholder="Paste title"
                            tabindex="0"
                        />
                        <ValidationError :errors="errors" class="mt-0" item="title" />
                    </div>

                    <div class="flex flex-col-reverse flex-wrap md:flex-col md:flex-nowrap gap-2 mt-2">
                        <div class="flex gap-1 justify-between items-end flex-wrap ">
                            <Label class="text-md hidden md:block">Content</Label>
                            <div class="flex gap-2 md:gap-1 w-full flex-wrap md:flex-nowrap">
                                <Label class="text-md md:hidden">Paste lifetime</Label>
                                <DropdownSelect
                                    id="dd-lifetime"
                                    v-model="selectedLifetime"
                                    :items="pasteLifetimeSelectItems"
                                    custom-class="w-full"
                                    description="How long should this paste be available?"
                                    header="Paste Lifetime"
                                    placeholder="Lifetime"
                                />

                                <Label class="text-md md:hidden">Visibility</Label>
                                <DropdownSelect
                                    id="dd-visibility"
                                    v-model="selectedVisibility"
                                    :items="pasteVisibilitySelectItems"
                                    custom-class="w-full"
                                    description="How should this paste be listed?"
                                    header="Visibility"
                                    placeholder="Visibility"
                                />

                                <Label class="text-md md:hidden">Paste styling (format)</Label>
                                <DropdownSelect
                                    id="dd-style"
                                    v-model="selectedStyle"
                                    :items="pasteStyleSelectItems"
                                    custom-class="w-full"
                                    description="How should we style your paste?"
                                    header="Styling"
                                    placeholder="Style"
                                />
                                <button
                                    v-if="pasteId"
                                    class="w-fit px-4 py-2 mt-0 rounded-md align-center gap-2 !bg-red-400 text-white hidden md:flex"
                                    data-modal-target="confirm-delete-modal"
                                    data-modal-toggle="confirm-delete-modal"
                                    type="button"
                                >
                                    <font-awesome-icon icon="fa-solid fa-trash-can" />
                                </button>
                                <div class="hidden md:flex gap-2 w-full">
                                    <button
                                        v-if="pasteId"
                                        class="w-fit px-4 py-2 mt-0 rounded-md flex align-center gap-2 !bg-red-400 text-white md:hidden"
                                        data-modal-target="confirm-delete-modal"
                                        data-modal-toggle="confirm-delete-modal"
                                        type="button"
                                    >
                                        <font-awesome-icon icon="fa-solid fa-trash-can" />
                                        <span class="break-keep">Delete</span>
                                    </button>
                                    <button
                                        :disabled="loading"
                                        class="primary w-full p-2 mt-0 rounded-md flex align-center gap-2"
                                        type="submit"
                                        @click.prevent="uploadPaste"
                                    >
                                        <font-awesome-icon class="text-sm" icon="fa-solid fa-cloud-arrow-up" />
                                        <span class="break-keep">{{ loading ? 'Uploading...' : pasteId ? 'Update Paste' : 'Upload Paste' }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="lg:mb-6">
                            <Label class="text-md mb-1 md:hidden">Content</Label>

                            <div :class="[ fullScreen ? 'fixed top-0 left-0 w-screen h-screen z-20': 'relative']" class="transition-all">
                                <Input
                                    ref="content"
                                    v-model="paste.content"
                                    :class="{'!rounded-none h-full': fullScreen}"
                                    :errors="errors"
                                    :is-textarea="true"
                                    class="w-full min-h-[34rem] lg:h-full relative"
                                    item="content"
                                    placeholder="Start typing here..."
                                    required
                                    wrap="off"
                                    @update:model-value="delete errors?.content"
                                />
                                <ValidationError :errors="errors" class="mt-0" item="content" />

                                <button
                                    ref="fullScreenButton"
                                    :style="contentStyling"
                                    class="top-2 absolute bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 py-2 px-3 rounded-md cursor-pointer transition select-none"
                                    type="button"
                                    @click="toggleFullScreen"
                                >
                                    <font-awesome-icon
                                        v-if="fullScreen"
                                        class="text-gray-900 dark:text-gray-300"
                                        icon="fa-solid fa-down-left-and-up-right-to-center"
                                    />
                                    <font-awesome-icon v-else class="text-gray-900 dark:text-gray-300" icon="fa-solid fa-up-right-and-down-left-from-center" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <StickyFooter class="md:hidden !px-0">
                        <div class="flex gap-2 w-full">
                            <button
                                v-if="pasteId"
                                class="w-fit px-4 py-2 mt-0 rounded-md flex align-center gap-2 !bg-red-400 text-white md:hidden"
                                data-modal-target="confirm-delete-modal"
                                data-modal-toggle="confirm-delete-modal"
                                type="button"
                            >
                                <font-awesome-icon icon="fa-solid fa-trash-can" />
                                <span class="break-keep">Delete</span>
                            </button>
                            <button
                                :disabled="loading"
                                class="primary w-full p-2 mt-0 rounded-md flex align-center gap-2"
                                type="submit"
                                @click.prevent="uploadPaste"
                            >
                                <font-awesome-icon class="text-sm" icon="fa-solid fa-cloud-arrow-up" />
                                <span class="break-keep">{{ loading ? 'Uploading...' : pasteId ? 'Update Paste' : 'Upload Paste' }}</span>
                            </button>
                        </div>
                    </StickyFooter>
                </form>
            </div>
            <ConfirmationModal
                v-if="pasteId"
                id="confirm-delete-modal"
                dangerous
                title="Are you sure you want to delete this paste?"
                @submit="deletePaste"
            />
        </NuxtLayout>
    </div>
</template>
