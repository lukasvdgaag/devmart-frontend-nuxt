<template>
    <div class="relative">
        <Input
            id="password"
            :errors="errors"
            :item="item"
            :type="passwordVisible ? 'text' : 'password'"
            :value="modelValue"
            autocomplete="new-password"
            class="block mt-1 w-full"
            name="password"
            placeholder="Password"
            required
            @update:model-value="$emit('update:modelValue', $event)"
        />
        <button
            class="absolute top-1/2 -translate-y-1/2 right-4 h-6 w-6 block p-0"
            title="Toggle showing the password"
            type="button"
            @click="passwordVisible = !passwordVisible"
        >
            <font-awesome-icon
                :icon="passwordVisible ? 'eye-slash' : 'eye'"
                class="h-full w-full text-gray-500"
            />
        </button>
    </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Input from '@/components/Common/Form/Input.vue';
import { FormErrors } from '@/interfaces/FormErrors.ts';

const {
    modelValue,
    item,
    errors
} = defineProps<{
    modelValue?: string,
    item?: string,
    errors?: FormErrors
}>();
defineEmits(['update:modelValue']);

const passwordVisible = ref(false);
</script>
