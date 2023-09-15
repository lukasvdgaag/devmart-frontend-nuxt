<template>
    <Combobox :value="modelValue" as="div" @update:modelValue="$emit('update:modelValue', $event)">
        <div class="relative mt-1">
            <div
                class="relative w-full cursor-default overflow-hidden rounded-md shadow-sm focus:ring dark:border-gray-700 border focus:ring-opacity-50 checked:bg-blue-600 border-gray-300 focus:border-indigo-300 focus:ring-indigo-200 bg-white dark:text-gray-300 dark:bg-gray-800">
                <ComboboxInput ref="input"
                               :displayValue="(person) => modelValue == null ? '' : person.username"
                               class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                               placeholder="Enter a username"
                               @change="query = $event.target.value"
                               @input="query = $event.target.value; searchUsers()"/>
                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg aria-hidden="true" class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd"
                              d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                              fill-rule="evenodd"></path>
                    </svg>
                </ComboboxButton>
            </div>

            <TransitionRoot leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            @after-leave="query = ''">
                <ComboboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <div v-if="users.length === 0" class="relative cursor-default select-none py-2 px-4 text-gray-700">
                        {{ query.length < 2 ? 'Enter at least 2 characters.' : 'Nothing found.' }}
                    </div>
                    <ComboboxOption v-for="user in users"
                                    :key="user.id"
                                    v-slot="{ selected, active }"
                                    :value="user"
                                    as="template">
                        <li :class="{'bg-primary-600 text-white': active, 'text-gray-900': !active }"
                            class="relative cursor-default select-none py-2 pl-10 pr-4">
                            <span :class="{ 'font-medium': selected, 'font-normal': !selected }" class="block truncate">
                                {{ `${user.username} (#${user.id})` }}
                            </span>
                            <span v-if="selected"
                                  :class="{ 'text-white': active, 'text-primary-600': !active }"
                                  class="absolute inset-y-0 left-0 flex items-center pl-3">
                                <font-awesome-icon aria-hidden="true" class="h-5 w-5" icon="check"/>
                            </span>
                        </li>
                    </ComboboxOption>
                </ComboboxOptions>
            </TransitionRoot>
        </div>
    </Combobox>
</template>

<script lang="ts" setup>
import {Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, TransitionRoot} from "@headlessui/vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import UserRepository from "@/services/UserRepository";
import User from "@/models/user/User.ts";
import {Ref, UnwrapNestedRefs} from "@vue/reactivity";

defineEmits(['update:modelValue']);

defineProps<{
    timeout?: number,
    modelValue?: object
}>();

let timerId = null;
const query: Ref<string> = ref('');
const users: UnwrapNestedRefs<Array<User>> = reactive([]);

const searchUsers = () => {
    if (query.value.length < 2) {
        users.splice(0, users.length); // clear the users array
        return;
    }

    if (timerId) {
        clearTimeout(timerId);
    }
    timerId = setTimeout(async () => {
        try {
            users.splice(0, users.length);
            users.push(await UserRepository.findUsersByUsername(this.query));
        } catch (error) {
            console.error(error);
        }
    }, 250);
}

</script>

