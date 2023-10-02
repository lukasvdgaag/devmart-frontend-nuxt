<template>
    <Input
        :accept="accept"
        :errors="errors"
        :item="item"
        :value="modelValue"
        class="mt-2 text-sm file:bg-black file:text-white file:rounded-l-md hover:file:bg-gray-800 file:font-poppins
                        file:transition cursor-pointer file:px-2 file:py-1 file:mr-2 w-full block border"
        type="file"
        @input="uploadFile"
    />
</template>

<script lang="ts" setup>
import Input from '@/components/common/form/Input.vue';
import { FormErrors } from '@/interfaces/FormErrors.ts';

export interface Props {
    modelValue?: string,
    accept?: string,
    errors?: FormErrors,
    item?: string,
}

withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    accept: '*',
    item: undefined,
    errors: () => ({} as FormErrors) // TODO check if this works
});

const emit = defineEmits(['update:modelValue', 'upload']);

const uploadFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
    emit('upload', target.files?.[0] ?? null);
};
</script>

<style scoped>
</style>
