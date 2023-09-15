<template>
    <div :class="{'mt-2': marginTop}" class="text-base muted">
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {defineProps} from 'vue';

export interface Props {
    marginTop: boolean
}

withDefaults(defineProps<Props>(), {
    marginTop: true
});
</script>
