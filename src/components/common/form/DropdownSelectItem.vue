<template>
    <li v-if="item.display()">
        <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <div class="flex items-center h-5">
                <input :id="id" :checked="item === selectedValue" :name="name" :value="item.value"
                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                       type="radio"
                       @change="$emit('change', item)">
            </div>
            <div class="ml-2 text-sm w-full">
                <label :for="id" class="font-medium text-gray-900 dark:text-gray-300">
                    <div>{{ item.text }}</div>
                    <p v-if="item.helperText && item.helperText.length > 0"
                       :id="`${id}-helper-text`"
                       class="text-xs font-normal text-gray-500 dark:text-gray-300">
                        {{ item.helperText }}
                    </p>
                </label>
            </div>
        </div>
    </li>
</template>

<script lang="ts" setup>
import DropdownSelectItemModel from '@/models/DropdownSelectItemModel';

const {item, name, id, selectedValue} = defineProps<{
    item: DropdownSelectItemModel,
    name: string,
    id: string,
    selectedValue?: DropdownSelectItemModel
}>();

defineEmits(['change']);
</script>
