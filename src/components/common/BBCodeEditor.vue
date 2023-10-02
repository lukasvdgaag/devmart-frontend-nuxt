<template>
    <div class="bbcode-editor-container flex flex-col">
        <div class="bbcode-editor-header flex flex-row">
            <div :class="{ active: !showParsed }" class="item" @click="showParsed = false">
                Editor
            </div>
            <div :class="{ active: showParsed }" class="item" @click="showParsed = true">
                Preview
            </div>
        </div>

        <BBCode v-if="showParsed" :source="parsedBBCode" class="bbcode-preview" />
        <Input
            v-else
            v-model="value"
            :is-textarea="true"
            :placeholder="placeholder"
            :required="required"
            class="bbcode-editor"
        />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Input from '@/components/Common/Form/Input.vue';
import BBCodeService from '@/services/BBCodeService';
import BBCode from '@/components/Common/BBCode.vue';

export interface Props {
    modelValue?: string,
    required?: boolean,
    placeholder?: string,
}

const { modelValue } = withDefaults(defineProps<Props>(), {
    modelValue: '',
    required: false,
    placeholder: 'BBCode content'
});

const emit = defineEmits(['update:modelValue']);

const showParsed = ref(false);

const parsedBBCode = computed(() => {
    return BBCodeService.parse(modelValue);
});

const value = computed({
    get(): string {
        return modelValue;
    },
    set(newValue: string): void {
        emit('update:modelValue', newValue);
    }
});
</script>

<style scoped>
</style>
