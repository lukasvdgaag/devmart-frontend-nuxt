<template>
    <div class="bbcode-editor-container flex flex-col">
        <div class="bbcode-editor-header flex flex-row">
            <div :class="{ active: !showParsed }" class="item" @click="showParsed = false">Editor</div>
            <div :class="{ active: showParsed }" class="item" @click="showParsed = true">Preview</div>
        </div>

        <BBCode v-if="showParsed" :source="parsedBBCode" class="bbcode-preview"/>
        <Input v-else
               v-model="modelValue"
               :is-textarea="true"
               :placeholder="placeholder"
               :required="required"
               class="bbcode-editor"/>
    </div>
</template>

<script lang="ts" setup>
import Input from '@/components/Common/Form/Input.vue';
import BBCodeParser from '@/services/BBCodeParser';
import BBCode from '@/components/Common/BBCode.vue';
import {computed, defineProps, ref} from 'vue';

export interface Props {
    modelValue?: string,
    required?: boolean,
    placeholder?: string,
}

const {modelValue} = withDefaults(defineProps<Props>(), {
    modelValue: '',
    required: false,
    placeholder: 'BBCode content'
})

const showParsed = ref(false);

const parsedBBCode = computed(() => {
    return BBCodeParser.parse(modelValue);
});
</script>

<style scoped>
</style>
