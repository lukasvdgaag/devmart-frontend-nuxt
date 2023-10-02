<template>
    <textarea
        v-if="isTextarea"
        :class="[
            hasError ? 'border-red-300 focus:border-red-300 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200',
            type === 'checkbox' ? 'p-2.5 rounded-md' : '',
        ]"
        :disabled="disabled"
        :maxlength="maxlength"
        :name="name"
        :value="modelValue"
        class="rounded-md shadow-sm focus:ring focus:ring-opacity-50 checked:bg-blue-600 w-full  dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700"
        @input="onInput"
    />

    <input
        v-else
        :class="[
            hasError ? 'border-red-300 focus:border-red-300 focus:ring-red-200' : 'border-gray-300 dark:border-gray-700 focus:border-indigo-300 dark:ring-offset-gray-700 focus:ring-indigo-200',
            type === 'checkbox' ? 'p-2.5 rounded-md' : '',
            disabled ? 'bg-gray-100 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600' :
            (`bg-white dark:bg-gray-800 ${type === 'checkbox' ? 'dark:text-blue-600' : 'dark:text-gray-300'}`)
        ]"
        :disabled="disabled"
        :maxlength="maxlength"
        :name="name"
        :type="type"
        :value="modelValue"
        class="!rounded-md shadow-sm dark:!shadow-gray-700 focus:ring dark:border-gray-700 focus:ring-opacity-50"
        @change="onChange"
        @changeDate="onChangeDate"
        @input="onInput"
    >
</template>

<script lang="ts" setup>
import { FormErrors } from '@/interfaces/FormErrors.ts';

export interface Props {
    modelValue?: any,
    errors?: FormErrors,
    item?: string,
    type?: string,
    isTextarea?: boolean,
    disabled?: boolean,
    maxlength?: number | string,
    name?: string,
}

const {
    errors,
    item
} = withDefaults(defineProps<Props>(), {
    type: 'text'
});

const emit = defineEmits(['update:modelValue', 'input', 'changeDate']);

const hasError = computed(() => {
    return errors && item && errors[item];
});

const onChange = (event: any) => {
    if (event.target.type === 'checkbox') {
        emit('update:modelValue', event.target.checked);
    } else {
        emit('update:modelValue', event.target.value);
    }
};

const onInput = (event: any) => {
    if (event.target.type === 'checkbox') {
        return;
    }
    emit('update:modelValue', event.target.value);
    emit('input', event);
};

const onChangeDate = (event: any) => {
    emit('changeDate', event);
    emit('update:modelValue', event.target.value);
};
</script>
