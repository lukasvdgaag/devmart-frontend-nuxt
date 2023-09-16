<template>
  <form @submit.prevent="login">
    <a class="button rounded-md primary flex flex-col align-center plain !p-3" href="/login-with-discord">
      <div class="flex flex-row gap-2">
        <font-awesome-icon :icon="['fab', 'discord']" class="icon light"/>
        <div class="text-base font-bold">Log in with Discord</div>
      </div>
    </a>

    <ValidationError :errors="errors" class="text-center" item="discord"/>

    <hr/>

    <div>
      <Label for="username" value="Username or Email"/>
      <Input
          id="username"
          v-model="data.username"
          :errors="errors"
          autofocus
          class="block mt-1 w-full"
          item="username"
          required
          type="text"
      />
    </div>
    <div class="mt-4">
      <Label for="password" value="Password"/>
      <Input
          id="password"
          v-model="data.password"
          :errors="errors"
          autocomplete="current-password"
          class="block mt-1 w-full"
          item="username"
          required
          type="password"
      />
    </div>

    <ValidationError :errors="errors" item="username"/>

    <div class="flex flex-row mt-2 center justify-between">
      <div>
        <label class="inline-flex items-center h-full" for="remember_me">
          <Input id="remember_me" v-model="data.remember" type="checkbox"/>
          <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">Remember me</span>
        </label>
      </div>
      <div>
        <router-link class="underline static text-sm" to="forgot-password">Forgot your password?</router-link>
      </div>
    </div>

    <div class="flex flex-col items-center justify-end mt-4">
      <button :disabled="loggingIn" class="primary w-full p-2">
        {{ loggingIn ? "Logging you in..." : "Log in" }}
      </button>
    </div>
    <div class="mt-4 text-center">
      No account yet?
      <router-link class="static" to="register">Sign up Now!</router-link>
    </div>
  </form>
</template>

<script lang="ts" setup>
import Label from "@/components/Common/Form/Label.vue";
import Input from "@/components/Common/Form/Input.vue";
import {useAuth} from "@/store/authStore";
import ValidationError from "@/components/Common/Form/ValidationError.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import FormErrors from "@/interfaces/FormErrors.ts";
import {Ref} from "@vue/reactivity";
import LoginBody from "@/interfaces/LoginBody.ts";
import {AxiosResponse} from "axios";
import {definePageMeta} from "../../.nuxt/imports";

definePageMeta({
  layout: 'auth-page-layout',
})

const errors: Ref<FormErrors> = ref({});
const data: LoginBody = reactive({
  username: "",
  password: "",
  remember: false,
});
const loggingIn: Ref<boolean> = ref(false);

const login = async () => {
  if (loggingIn.value) return;
  loggingIn.value = true;

  try {
    const response = await useAuth().login(data);
    if (response.status === 200) {
      if (useRoute().query.redirect) {
        // redirect to redirect query if exists
        useRouter().push(useRoute().query.redirect);
      } else {
        // push to home if no redirect
        useRouter().push('/');
      }
    } else {
      errors.value = response.data.errors;
    }
  } catch (e: AxiosResponse | any) {
    errors.value = e?.response?.data?.errors ?? {};
  }

  loggingIn.value = false;
};

onBeforeMount(() => {
  if (useRoute().query?.error === "discord") {
    errors.value = {
      discord: ["No account found with this Discord account!"],
    };
  }
});
</script>
