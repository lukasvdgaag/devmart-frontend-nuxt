<template>
    <component
        :is="external ? 'a' : 'router-link'"
        v-if="url"
        :class="customClass"
        :href="external ? url : ''"
        :target="external ? '_blank' : ''"
        :to="!external ? url : ''"
        class="quicklink col-span-1"
    >
        <div class="flex flex-col">
            <div class="flex items-center gap-3">
                <font-awesome-icon :icon="icon" class="text-xl" />
                <div class="font-semibold text-lg">
                    {{ label }}
                </div>
            </div>
            <p v-if="description" class="mt-1">
                {{ description }}
            </p>
            <a v-if="linkText" class="static mt-2">{{ linkText }}</a>
        </div>
    </component>

    <div v-else :class="customClass" class="quicklink col-span-4 plain grid-half-small grid-full-smallest">
        <div class="flex flex-col justify-between w-full h-full">
            <template v-if="icon">
                <div class="flex flex-col">
                    <Icon :src="icon" is-font-awesome />
                    <MutedText>{{ label }}</MutedText>
                </div>
                <div class="flex flex-col content-center mt-2 mb-2 w-full font-bold text-2xl">
                    <slot />
                </div>
            </template>
            <template v-else>
                <MutedText>{{ label }}</MutedText>
                <slot />
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Icon from '@/components/Common/Icon/Icon.vue';
import MutedText from '@/components/Common/MutedText.vue';

export interface Props {
    customClass?: string,
    label: string,
    description?: string,
    linkText?: string,
    icon?: string,
    external?: boolean,
    url?: string | object
}

withDefaults(defineProps<Props>(), {
    customClass: '',
    external: false
});
</script>
