<template>
    <div class="h-full">
        <NuxtLayout header="Register." name="auth-page-layout" subheader="Welcome to Devmart 👋">
            <NuxtLink class="button rounded-md primary flex flex-row gap-2 align-center plain p-3" to="/register-with-discord">
                <font-awesome-icon :icon="['fab', 'discord']" class="icon light" />
                <div class="text-base font-bold">
                    Sign up with Discord
                </div>
            </NuxtLink>
            <ValidationError :errors="errors" item="discord" />

            <hr>

            <Alert v-if="discordErrorType === 'username_in_use'" class="mb-4" type="warning">
                The username that is linked to your Discord account is already in use or contains non-alphanumeric characters.
                Please pick another one.
            </Alert>

            <form @submit.prevent="register">
                <div class="relative">
                    <Label for="username" value="Username" />
                    <Input
                        id="username"
                        ref="usernameInput"
                        v-model="data.username"
                        :errors="errors"
                        autofocus
                        class="block mt-1 w-full"
                        item="username"
                        maxlength="50"
                        placeholder="Username"
                        required
                        type="text"
                        @update:model-value="checkUsernameValidity"
                    />
                    <ValidationError :errors="errors" item="username" />

                    <InputRequirementList
                        ref="usernameReqs"
                        :requirements="[{type: 'min', value: 3}, {type: 'type', value: 'username'}]"
                        :value="data.username"
                    />
                </div>

                <div class="mt-3">
                    <Label for="email" value="Email" />
                    <Input
                        id="email"
                        v-model="data.email"
                        :errors="errors"
                        class="block mt-1 w-full"
                        item="email"
                        maxlength="255"
                        name="email"
                        placeholder="Email"
                        required
                        type="email"
                        @update:model-value="delete errors?.email"
                    />
                    <ValidationError :errors="errors" item="email" />
                </div>

                <div class="mt-3">
                    <Label for="password" value="Password" />
                    <PasswordInput v-model="data.password" :errors="errors" item="password" @update:model-value="delete errors?.password" />
                    <ValidationError :errors="errors" item="password" />
                    <InputRequirementList ref="passwordReqs" :requirements="[{type:'min', value:8}]" :value="data.password" />
                </div>

                <div class="mt-3">
                    <label class="inline-flex items-center h-full" for="accept_tos">
                        <Input
                            id="accept_tos"
                            v-model="data.accept_tos"
                            class="rounded"
                            name="accept_tos"
                            required
                            type="checkbox"
                        />
                        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            I have read and agree to Devmart's
                            <NuxtLink class="static" target="_blank" to="/terms-of-service">Terms of Service</NuxtLink>.
                        </span>
                    </label>
                </div>

                <div class="flex flex-col items-center justify-end mt-4">
                    <button :disabled="loading" class="primary w-full p-2">
                        {{ loading ? 'Signing up...' : 'Sign Up' }}
                    </button>
                    <ValidationError :errors="errors" item="general" />
                </div>
                <div class="mt-4 text-center">
                    Already got an account?
                    <NuxtLink :to="{ name: 'login' }" class="static">
                        Login Now!
                    </NuxtLink>
                </div>
            </form>
        </NuxtLayout>
    </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue';

import { initPopovers } from 'flowbite';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Label from '@/components/Common/Form/Label.vue';
import Input from '@/components/Common/Form/Input.vue';
import ValidationError from '@/components/Common/Form/ValidationError.vue';
import Alert from '@/components/Common/Alert.vue';
import PasswordInput from '@/components/Common/Form/PasswordInput.vue';
import InputRequirementList from '@/components/Common/Form/InputRequirementList.vue';
import AuthService from '@/services/AuthService.js';
import { useAuth } from '@/store/authStore.js';

const loading = ref(false);
const discordErrorType = ref<string | null>(null);
const errors = ref<{ [key: string]: string[] }>({});
const data = reactive({
    username: ref(''),
    email: ref(''),
    password: ref(''),
    accept_tos: false
});

const usernameReqs: Ref<typeof InputRequirementList | undefined> = ref();
const passwordReqs: Ref<typeof InputRequirementList | undefined> = ref();

const determineDiscordErrorMessage = () => {
    switch (discordErrorType.value) {
    case 'invalid_request':
        return 'No code was provided or the code was invalid.';
    case 'email_not_verified':
        return 'The email address associated with your Discord account is not verified.';
    case 'email_in_use':
        return 'The email address associated with your Discord account is already in use.';
    case 'discord_in_use':
        return 'The Discord account is already in use.';
    case 'creation_failed':
        return 'The account could not be created.';
    case 'verification_failed':
        return 'We failed to verify your authentication request.';
    default:
        return 'An unknown error occurred.';
    }
};

const checkUsernameValidity = () => {
    data.username = data.username.replaceAll(' ', '_');
    delete errors.value.username;
};

const checkErrors = () => {
    if (!usernameReqs.value?.metAllRequirements()) {
        errors.value.username = ['Please enter a valid username.'];
    }
    if (!passwordReqs.value?.metAllRequirements()) {
        errors.value.password = ['Please enter a valid password.'];
    }

    return Object.keys(errors.value).length === 0;
};

const register = async () => {
    loading.value = true;
    if (!checkErrors()) {
        loading.value = false;
        return;
    }

    try {
        const res = await AuthService.registerUser(data, useRoute().query?.discord_auth_token);
        if (res && res.status === 201) {
            useAuth().user = res.data;
            useAuth().loaded = true;

            useRouter().push({ name: 'home' });
        } else {
            errors.value = { general: ['An unknown error occurred.'] };
        }
    } catch (res: any) {
        errors.value = res.response.data?.errors ?? {};
    } finally {
        loading.value = false;
    }
};

onBeforeMount(() => {
    const query = Object.assign({}, useRoute().query);

    if (query.email) {
        data.email = query.email;
    }
    if (query.username) {
        data.username = query.username;
    }

    if (query.discord_error) {
        discordErrorType.value = query.discord_error;
    }
});

onMounted(() => {
    initPopovers();

    const query = Object.assign({}, useRoute().query);
    if (query.discord_error) {
        if (query.discord_error === 'username_in_use') {
            errors.value.username = [usernameReqs.value?.metAllRequirements() ? 'This username is taken.' : 'This username is invalid.'];
        } else {
            errors.value.discord = [determineDiscordErrorMessage()];
        }
    }
});
</script>
