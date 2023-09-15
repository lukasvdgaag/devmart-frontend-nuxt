<template>
    <div class="mt-2 my-0 mb-5 relative flex flex-row gap-2.5">
        <button
            v-if="filterButton"
            ref="filterButton"
            class="flex gap-3 w-fit break-keep min-h-[48px] h-full items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            data-dropdown-placement="bottom-start"
            data-dropdown-toggle="filter-dropdown"
            @click.prevent="$emit('clickFilter')"
        >
            <font-awesome-icon class="text-gray-500" icon="filter"/>
            Filter
        </button>

        <div class="relative w-full">
            <input
                v-model="input"
                :placeholder="placeholder"
                class="bg-gray-250 dark:bg-gray-800 rounded-lg border-none px-4 text-base py-3 w-full"
                type="text"
                @input="updateInput"
            />
            <div
                :class="[inputEmpty ? 'cursor-not-allowed' : 'cursor-pointer']"
                class="absolute top-1 right-1 h-10 w-10 p-2 bg-gray-250 dark:bg-gray-800"
                role="button"
                @click="clearInput"
            >
                <font-awesome-icon
                    :class="[!inputEmpty ? 'text-black dark:text-gray-200' : 'text-gray-400']"
                    class="h-full w-full transition"
                    icon="circle-xmark"
                />
            </div>
        </div>
        <div
            :class="{'bg-opacity-50': disabled, 'cursor-not-allowed': inputEmpty || disabled}"
            class="bg-primary h-full min-h-[48px] aspect-square transition rounded-lg cursor-pointer flex items-center justify-center"
            @click="submit"
        >
            <font-awesome-icon class="text-white text-2xl" icon="magnifying-glass"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {Ref} from "@vue/reactivity";

export interface Props {
    modelValue?: string,
    placeholder?: string,
    disabled?: boolean,
    filterButton?: boolean
}

const {modelValue, placeholder, disabled, filterButton} = withDefaults(defineProps<Props>(), {
    disabled: false,
});
const emit = defineEmits(['update:modelValue', 'clickFilter']);

const input: Ref<string> = ref(modelValue);
const inputEmpty = computed(() => input.value.length === 0);

const updateInput = (value: string) => {
    input.value = value;
    emit("update:modelValue", input.value);
}
const clearInput = () => {
    if (input.value === "") return;
    input.value = "";
    updateInput(input.value);
    submit(true);
}
const submit = (force: boolean = false) => {
    if (!force && disabled) return;
    emit("submit", input.value);
}
</script>