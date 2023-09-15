<template>
    <label :class="{small: small}" class="switch mt-0">
        <input :id="id"
               :checked="checked"
               :name="name"
               :value="modelValue"
               type="checkbox"
               @change="this.$emit('update:modelValue', $event.target.checked)">
        <span class="slider"></span>
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
    small: false,
});
</script>

<style scoped>

</style>
