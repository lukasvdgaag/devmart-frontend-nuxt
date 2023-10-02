<template>
    <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400 mt-1">
        <template v-for="(item) in values">
            <li v-if="item?.show" :key="item?.type" class="flex items-center gap-2">
                <font-awesome-icon v-if="item.met" class="text-green-500 dark:text-green-400" icon="circle-check" />
                <font-awesome-icon v-else class="text-gray-400" icon="circle-check" />

                {{ item.text }}
            </li>
        </template>
    </ul>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { InputRequirement } from '@/models/components/InputRequirement.ts';
import { InputRequirementValues } from '@/models/components/InputRequirementValues.ts';

const props = defineProps<{
    requirements: InputRequirement[],
    value: string
}>();

const values: InputRequirementValues = reactive({
    min: {
        text: 'At least {min} characters',
        met: false,
        show: false,
        value: undefined
    },
    max: {
        text: 'Maximum {max} characters',
        met: false,
        show: false,
        value: undefined
    },
    regex: {
        text: 'Must match the following regex: {regex}',
        met: false,
        show: false,
        value: undefined
    },
    type: undefined
});

const updateValues = () => {
    values.min.met = !values.min.value || props.value.length >= values.min.value;
    values.max.met = !values.max.value || (props.value.length > 0 && props.value.length <= values.max.value);
    values.regex.met = !values.regex.value || values.regex.value.test(props.value);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metAllRequirements = () => {
    if (values.min.value && !values.min.met) {
        return false;
    }
    if (values.max.value && !values.max.met) {
        return false;
    }
    return !values.regex.value || values.regex.met;
};

onMounted(() => {
    props.requirements.forEach((requirement) => {
        switch (requirement.type) {
        case 'min':
        case 'max':
        case 'regex': {
            const requirementValue = values[requirement.type];
            requirementValue.value = requirement.value;
            requirementValue.text = values.min.text.replace('{min}', requirement.value);
            requirementValue.show = true;
            break;
        }
        case 'type': {
            values.type = requirement.value;
            if (requirement.value === 'username') {
                values.regex.value = /^[a-zA-Z0-9_-]+$/;
                values.regex.text = 'Only alphanumeric characters (a-z, 0-9, _, -)';
                values.regex.show = true;
            }
        }
        }
    });

    updateValues();
});

watch(() => props.value, updateValues);
</script>
