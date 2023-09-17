<script lang="ts" setup>

import Input from "@/components/common/form/Input.vue";
import ValidationError from "@/components/common/form/ValidationError.vue";
import DropdownSelect from "@/components/common/form/DropdownSelect.vue";
import Label from "@/components/common/form/Label.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import StickyFooter from "@/components/common/StickyFooter.vue";
import ConfirmationModal from "@/components/common/modal/ConfirmationModal.vue";
import Paste from "@/models/paste/Paste.ts";
import {Ref} from "@vue/reactivity";
import {PasteVisibility} from "@/models/paste/PasteVisibility.ts";
import {PasteStyle} from "@/models/paste/PasteStyle.ts";
import FormErrors from "@/interfaces/FormErrors.ts";
import DropdownSelectItem from "@/models/components/DropdownSelectItem.ts";
import {useAuth} from "@/store/authStore.ts";
import {PasteCreateBody} from "@/models/rest/paste/PasteCreateBody.ts";
import {AxiosError} from "axios";
import PasteRepository from "@/services/repository/PasteRepository.ts";
import {initDropdowns, initModals} from "flowbite";

// props
const props = defineProps<{
    pasteId?: string,
    isCreatePage?: boolean
}>();

// data variables
const paste = ref(new Paste());
const fullScreenBtnRight = ref('0.5rem');
const fullScreen = ref(false);
const loading = ref(false);
const selectedLifetime: Ref<DropdownSelectItem | undefined> = ref();
const selectedVisibility: Ref<DropdownSelectItem | undefined> = ref();
const selectedStyle: Ref<DropdownSelectItem | undefined> = ref();
const errors: Ref<FormErrors> = ref({});
const lifetimeSelectItems: DropdownSelectItem[] = [
    new DropdownSelectItem('7 days', null, '7d'),
    new DropdownSelectItem('2 weeks', null, '2w'),
    new DropdownSelectItem('1 month', null, '1m', () => useAuth().loggedIn),
    new DropdownSelectItem('3 months', null, '3m', () => useAuth().loggedIn && useAuth().user?.role === 'admin'),
    new DropdownSelectItem('Unlimited', 'This paste will never expire.', 'never', () => useAuth().loggedIn && useAuth().user?.role === 'admin')
];
const visibilitySelectItems: DropdownSelectItem[] = [
    new DropdownSelectItem('Public', 'Anyone can view this paste.', 'PUBLIC'),
    new DropdownSelectItem('Unlisted', 'Only people with the link can view this paste.', 'UNLISTED', () => useAuth().loggedIn),
    new DropdownSelectItem('Private', 'Only you can view this paste.', 'PRIVATE', () => useAuth().loggedIn)
];
const styleSelectItems: DropdownSelectItem[] = [
    new DropdownSelectItem('Automatic', 'The style will be automatically detected.', null),
    new DropdownSelectItem('Java', null, 'Java'),
    new DropdownSelectItem('YAML', null, 'YAML'),
    new DropdownSelectItem('XML', null, 'XML'),
    new DropdownSelectItem('Error', null, 'less'),
    new DropdownSelectItem('JSON', null, 'JSON'),
    new DropdownSelectItem('HTML', null, 'HTML'),
    new DropdownSelectItem('JavaScript', null, 'JavaScript'),
    new DropdownSelectItem('PHP', null, 'PHP'),
    new DropdownSelectItem('No Style', "Don't apply any styling.", 'none')
]

const content: Ref<HTMLElement | undefined> = ref();

// methods
const onContentScroll = () => {
    if ((content.value?.scrollHeight as number) >= (content.value?.clientHeight as number)) {
        const scrollBarWidth = (content.value?.offsetWidth as number) - (content.value?.clientWidth as number);
        fullScreenBtnRight.value = 'calc(0.5rem + ' + scrollBarWidth + 'px)';
    } else {
        fullScreenBtnRight.value = '0.5rem';
    }
}

const checkForErrors = (): boolean => {
    errors.value = {};

    if (!paste.value?.content || paste.value?.content?.length === 0) {
        errors.value.content = ["The content field is required."];
    }

    return Object.keys(errors.value)?.length === 0;
}

const fetchPaste = async () => {
    try {
        paste.value = await PasteRepository.fetchPaste(props.pasteId as string);
        if ((!paste.value.creator || paste.value.creator !== useAuth().user?.id) && useAuth().user?.role !== 'admin') {
            paste.value = new Paste();
            return useRouter().push('/paste');
        }

        selectedVisibility.value = visibilitySelectItems.find(item => {
            console.log(item.value, paste.value.visibility);
            return item.value === paste.value.visibility
        });
        selectedLifetime.value = lifetimeSelectItems.find(item => item.value === paste.value.lifetime);
        selectedStyle.value = styleSelectItems.find(item => item.value === paste.value.style);
        setTimeout(onContentScroll, 10);
    } catch (e) {
        return useRouter().push('/paste');
    }
}

const uploadPaste = async () => {
    if (loading.value) return;

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
        const res = props.pasteId ? await PasteRepository.updatePaste(props.pasteId, body) : await PasteRepository.createPaste(body);
        errors.value = {};
        if (res) {
            useRouter().push(`/paste/${res.name}`);
        }
    } catch (e: AxiosError | any) {
        console.error(e);
        errors.value = e.response.data.errors;
    } finally {
        loading.value = false;
    }
}

const deletePaste = async () => {
    if (loading.value) return;

    loading.value = true;
    try {
        if (await PasteRepository.deletePaste(props.pasteId as string)) {
            paste.value = new Paste();
            useRouter().push({name: 'paste'});
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
}

const toggleFullScreen = () => {
    fullScreen.value = !fullScreen.value;
    setTimeout(onContentScroll, 10);
}

// computed
const contentStyling = computed(() => {
    return {
        right: fullScreenBtnRight.value
    }
});

// hooks
onBeforeMount(() => {
    if (props.pasteId) {
        fetchPaste();
    }
});
onMounted(() => {
    initDropdowns();
    initModals();
});

watch(() => paste.value.content, onContentScroll);

</script>

<template>
    <div class="h-full">
        <NuxtLayout :is-create-page="isCreatePage ?? true" name="paste-page-layout">
            <div class="flex flex-col gap-2 w-full h-full">
                <h2 class="dark:text-gray-100 text-3xl mb-4 mt-1">{{ pasteId ? 'Edit your Paste' : 'Create a new Paste' }}</h2>

                <form class="h-full">
                    <div class="flex flex-col gap-1">
                        <Label class="text-md">Title</Label>
                        <Input v-model="paste.title"
                               :errors="errors"
                               class="w-full px-4 text-base"
                               item="title"
                               maxlength="50"
                               placeholder="Paste title"
                               tabindex="0"
                        />
                        <ValidationError :errors="errors" class="mt-0" item="title"/>
                    </div>

                    <div class="flex flex-col-reverse flex-wrap md:flex-col md:flex-nowrap gap-2 mt-2">
                        <div class="flex gap-1 justify-between items-end flex-wrap ">
                            <Label class="text-md hidden md:block">Content</Label>
                            <div class="flex gap-2 md:gap-1 w-full flex-wrap md:flex-nowrap">
                                <Label class="text-md md:hidden">Paste lifetime</Label>
                                <DropdownSelect
                                    id="dd-lifetime"
                                    v-model="selectedLifetime"
                                    :items="lifetimeSelectItems"
                                    custom-class="w-full"
                                    description="How long should this paste be available?"
                                    header="Paste Lifetime"
                                    placeholder="Lifetime"
                                />

                                <Label class="text-md md:hidden">Visibility</Label>
                                <DropdownSelect
                                    id="dd-visibility"
                                    v-model="selectedVisibility"
                                    :items="visibilitySelectItems"
                                    custom-class="w-full"
                                    description="How should this paste be listed?"
                                    header="Visibility"
                                    placeholder="Visibility"
                                />

                                <Label class="text-md md:hidden">Paste styling (format)</Label>
                                <DropdownSelect
                                    id="dd-style"
                                    v-model="selectedStyle"
                                    :items="styleSelectItems"
                                    custom-class="w-full"
                                    description="How should we style your paste?"
                                    header="Styling"
                                    placeholder="Style"
                                />
                                <button v-if="pasteId"
                                        class="w-fit px-4 py-2 mt-0 rounded-md align-center gap-2 !bg-red-400 text-white hidden md:flex"
                                        data-modal-target="confirm-delete-modal"
                                        data-modal-toggle="confirm-delete-modal"
                                        type="button">
                                    <font-awesome-icon icon="fa-solid fa-trash-can"/>
                                </button>
                                <div class="hidden md:flex gap-2 w-full">
                                    <button v-if="pasteId"
                                            class="w-fit px-4 py-2 mt-0 rounded-md flex align-center gap-2 !bg-red-400 text-white md:hidden"
                                            data-modal-target="confirm-delete-modal"
                                            data-modal-toggle="confirm-delete-modal"
                                            type="button">
                                        <font-awesome-icon icon="fa-solid fa-trash-can"/>
                                        <span class="break-keep">Delete</span>
                                    </button>
                                    <button :disabled="loading"
                                            class="primary w-full p-2 mt-0 rounded-md flex align-center gap-2"
                                            type="submit"
                                            @click.prevent="uploadPaste">
                                        <font-awesome-icon class="text-sm" icon="fa-solid fa-cloud-arrow-up"/>
                                        <span class="break-keep">{{ loading ? "Uploading..." : pasteId ? "Update Paste" : "Upload Paste" }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="lg:mb-6">
                            <Label class="text-md mb-1 md:hidden">Content</Label>

                            <div :class="[ fullScreen ? 'fixed top-0 left-0 w-screen h-screen z-20': 'relative']" class="transition-all">
                                <Input ref="content"
                                       v-model="paste.content"
                                       :class="{'!rounded-none h-full': fullScreen}"
                                       :errors="errors"
                                       :is-textarea="true"
                                       class="w-full min-h-[34rem] lg:h-full relative"
                                       item="content"
                                       placeholder="Start typing here..."
                                       required
                                       wrap="off"
                                       @update:modelValue="delete this.errors?.content"
                                />
                                <ValidationError :errors="errors" class="mt-0" item="content"/>

                                <button
                                    ref="fullScreenButton"
                                    :style="contentStyling"
                                    class="top-2 absolute bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 py-2 px-3 rounded-md cursor-pointer transition select-none"
                                    type="button"
                                    @click="toggleFullScreen">
                                    <font-awesome-icon v-if="fullScreen" class="text-gray-900 dark:text-gray-300"
                                                       icon="fa-solid fa-down-left-and-up-right-to-center"/>
                                    <font-awesome-icon v-else class="text-gray-900 dark:text-gray-300" icon="fa-solid fa-up-right-and-down-left-from-center"/>
                                </button>
                            </div>
                        </div>
                    </div>

                    <StickyFooter class="md:hidden !px-0">
                        <div class="flex gap-2 w-full">
                            <button v-if="pasteId"
                                    class="w-fit px-4 py-2 mt-0 rounded-md flex align-center gap-2 !bg-red-400 text-white md:hidden"
                                    data-modal-target="confirm-delete-modal"
                                    data-modal-toggle="confirm-delete-modal"
                                    type="button">
                                <font-awesome-icon icon="fa-solid fa-trash-can"/>
                                <span class="break-keep">Delete</span>
                            </button>
                            <button :disabled="loading"
                                    class="primary w-full p-2 mt-0 rounded-md flex align-center gap-2"
                                    type="submit"
                                    @click.prevent="uploadPaste">
                                <font-awesome-icon class="text-sm" icon="fa-solid fa-cloud-arrow-up"/>
                                <span class="break-keep">{{ loading ? "Uploading..." : pasteId ? "Update Paste" : "Upload Paste" }}</span>
                            </button>
                        </div>
                    </StickyFooter>
                </form>
            </div>
            <ConfirmationModal v-if="pasteId"
                               id="confirm-delete-modal"
                               dangerous
                               title="Are you sure you want to delete this paste?"
                               @submit="deletePaste"/>
        </NuxtLayout>
    </div>
</template>