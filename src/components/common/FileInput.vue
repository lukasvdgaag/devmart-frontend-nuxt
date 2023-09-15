<template>
    <Input :accept="accept"
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
import Input from '@/components/Common/Form/Input.vue';
import {defineEmits, defineProps} from 'vue';

export interface Props {
    modelValue?: string,
    accept?: string,
    errors?: object,
    item?: string,
}

withDefaults(defineProps<Props>(), {
    modelValue: null,
    accept: '*',
    errors: {},
    item: null,
})

const emit = defineEmits(['update:modelValue', 'upload']);

const uploadFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
    emit('upload', target.files?.[0] ?? null);
};
</script>

<style scoped>
</style>
