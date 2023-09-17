<template>
    <button :class="customClass"
            :data-dropdown-toggle="id"
            class="bg-white dark:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-400 px-4 py-2 rounded-md flex items-center justify-between border
              border-gray-300 dark:border-gray-600 focus:ring focus:ring-opacity-50 focus:border focus:border-indigo-300 focus:ring-indigo-200"
            role="button" type="button">
        <span>{{ value?.text ?? placeholder }}</span>
        <font-awesome-icon class="ml-3 text-sm" icon="fa-solid fa-chevron-down"/>
    </button>

    <Dropdown :id="id" :description="description" :fullWidth="fullWidth" :header="header">
        <ul aria-labelledby="dropdownRadioHelperButton" class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
            <DropdownSelectItem
                v-for="(item, i) in items"
                :id="`${id}-${i}`"
                :key="i"
                :item="item"
                :name="`${id}-input`"
                :selected-value="value"
                @change="handleInput"
            />
        </ul>
    </Dropdown>
</template>

<script lang="ts" setup>
import DropdownSelectItem from '@/components/Common/Form/DropdownSelectItem.vue';
import DropdownSelectItemModel from '@/models/components/DropdownSelectItem.ts';
import Dropdown from '@/components/Common/Form/Dropdown.vue';
import {defineEmits, defineProps} from 'vue';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {Ref} from "@vue/reactivity";

export interface Props {
    modelValue?: DropdownSelectItemModel,
    id: string,
    placeholder?: string,
    items: Array<DropdownSelectItemModel>,
    header?: string,
    description?: string,
    customClass?: string,
    fullWidth?: boolean,
}

const {modelValue} = withDefaults(defineProps<Props>(), {
    placeholder: 'select',
    header: '',
    description: '',
    customClass: ''
});

const emit = defineEmits(['update:modelValue']);

let value: Ref<DropdownSelectItemModel | undefined> = ref(modelValue);

const handleInput = (newValue: DropdownSelectItemModel) => {
    value.value = newValue;
    emit('update:modelValue', newValue);
};
</script>
