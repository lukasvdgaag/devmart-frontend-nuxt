<template>
    <div :class="{'mt-2': marginTop}" class="text-base muted">
        <slot v-html="html" />
    </div>
</template>

<script lang="ts" setup>

export interface Props {
    marginTop: boolean,
    html?: string
}

withDefaults(defineProps<Props>(), {
    marginTop: true
});
</script>
