<script lang="ts" setup>

// props
import { Ref } from 'vue';
import highlighter from 'highlight.js';
import { PasteStyle } from '@/models/paste/PasteStyle.ts';
import '@/assets/css/highlight/github.css';
import '@/assets/css/highlight/github-dark.css';

const {
    code,
    language
} = defineProps<{
    code: string,
    language: string | undefined
}>();

// data
const codeLines: Ref<string[]> = ref([]);
const allowedLanguages = ['javascript', 'java', 'yaml', 'less', 'json', 'html', 'css', 'php', 'xml'];

// methods
const highlight = () => {
    let value;
    if (language === PasteStyle.NONE) {
        value = code;
    } else if (language) {
        value = highlighter.highlight(code, { language }).value;
    } else {
        value = highlighter.highlightAuto(code, allowedLanguages).value;
    }

    codeLines.value = value.split('\n');
    codeLines.value = codeLines.value.map((line) => {
        if (line === '') {
            return '\n';
        }
        return line;
    });
};

// hooks
onBeforeMount(() => {
    highlight();
});
</script>

<template>
    <div class="codeblock overflow-x-auto overflow-y-hidden bg-gray-100 dark:bg-gray-800 rounded-lg">
        <table>
            <tbody>
                <tr v-for="(line, index) in codeLines" :id="`L${index}`" :key="index">
                    <td class="code-line text-gray-400 text-right whitespace-nowrap select-none w-1 min-w-12">
                        {{ index + 1 }}
                    </td>
                    <td class="table-cell overflow-visible text-gray-900 dark:text-gray-200 whitespace-pre break-all" v-html="line" />
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
td {
    @apply p-0 px-2 text-base leading-6 font-mono relative;
}

tr {
    @apply box-border border-spacing-0 border-collapse !border-t-0;
}

tr:first-child td {
    @apply pt-3
}

tr:last-child td {
    @apply pb-3
}
</style>
