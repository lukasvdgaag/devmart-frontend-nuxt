<template>
    <label :class="{small: small}" class="switch mt-0">
        <input
            :id="id"
            :checked="checked"
            :name="name"
            :value="modelValue"
            type="checkbox"
            @change="$emit('update:modelValue', $event.target.checked)"
        >
        <span class="slider" />
    </label>
</template>

<script lang="ts" setup>

export interface Props {
    modelValue?: boolean,
    checked?: boolean,
    small?: boolean,
    name: string,
    id: string
}

withDefaults(defineProps<Props>(), {
    modelValue: false,
    checked: false,
    small: false
});

defineEmits(['update:modelValue']);
</script>

<style scoped>

</style>
