<template>
    <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400 mt-1">
        <template v-for="(item, index) in values">
            <li v-if="item.show" class="flex items-center gap-2">
                <font-awesome-icon v-if="item.met" class="text-green-500 dark:text-green-400" icon="circle-check"/>
                <font-awesome-icon v-else class="text-gray-400" icon="circle-check"/>

                {{ item.text }}
            </li>
        </template>
    </ul>
</template>

<script lang="ts" setup>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

defineProps<{
    requirements: Array,
    value: string
}>()

const values = reactive({
    min: {
        text: 'At least {min} characters',
        met: false,
        show: false,
    },
    max: {
        text: 'Maximum {max} characters',
        met: false,
        show: false,
    },
    regex: {
        text: 'Must match the following regex: {regex}',
        met: false,
        show: false,
    },
});

let min = 0;
let max = undefined;
let regex = undefined;
let type = undefined;

const updateValues = () => {
    values.min.met = !min || value.length >= min;
    values.max.met = !max || (value.length > 0 && value.length <= max);
    values.regex.met = !regex || regex.test(value);
};

const metAllRequirements = () => {
    if (min && !values.min.met) return false;
    if (max && !values.max.met) return false;
    return !regex || values.regex.met;
};

onMounted(() => {
    requirements.forEach((requirement) => {
        if (requirement.startsWith('min:')) {
            min = parseInt(requirement.replace('min:', ''));
            values.min.text = values.min.text.replace('{min}', min);
            values.min.show = true;
        } else if (requirement.startsWith('max:')) {
            max = parseInt(requirement.replace('max:', ''));
            values.max.text = values.max.text.replace('{max}', max);
            values.max.show = true;
        } else if (requirement.startsWith('regex:')) {
            if (type !== 'username') return;
            regex = new RegExp(requirement.replace('regex:', ''));
            values.regex.text = values.regex.text.replace('{regex}', regex);
            values.regex.show = true;
        } else if (requirement.startsWith('type:')) {
            type = requirement.replace('type:', '');
            if (type === 'username') {
                regex = new RegExp('^[a-zA-Z0-9_-]+$');
                values.regex.text = 'Only alphanumeric characters (a-z, 0-9, _, -)';
                values.regex.show = true;
            }
        }
    });

    updateValues();
});

watch(value, updateValues);
</script>
