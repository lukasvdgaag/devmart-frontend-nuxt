<script lang="ts" setup>
import {initDropdowns} from "flowbite";
import NavPopupItem from "./NavPopupItem.vue";
import User from "@/models/user/User.ts";
import {useAuth} from "@/store/authStore.ts";
import Logo from "@/components/common/Logo.vue";

export interface Props {
    background: boolean
}

const {background} = withDefaults(defineProps<Props>(), {
    background: false
})

const user = useAuth().user as User | undefined;
const darkMode = ref(false);

const loginLink = computed(() => {
    const uri = {name: 'login'} as any;

    if (useRouter().name !== 'home') {
        uri.query = {redirect: useRouter().fullPath};
    }
    return uri;
});

const logoutUser = () => {
    useAuth().logout();
};

const switchTheme = () => {
    document.documentElement.classList.toggle("dark");
    darkMode.value = !darkMode.value;
};

onBeforeMount(() => {
    useAuth().applyTheme();
    darkMode.value = document.documentElement.classList.contains("dark");
});

onMounted(() => {
    initDropdowns();
});
</script>

<template>
    <header :class="{'header-filled': background}" class="header-big d-grid z-10">
        <nav class="flex flex-row justify-between items-center">
            <NuxtLink class="nav-side" exact-active-class="lmWixQ" to="/">
                <Logo class="header-logo"/>
            </NuxtLink>

            <div class="nav-links">
                <NuxtLink class="nav-link" exact-active-class="active" to="/">Home</NuxtLink>
                <!--                <NuxtLink :to="{name: 'plugins'}" active-class="active" class="nav-link">Plugins</NuxtLink>-->
                <NuxtLink :to="{name: 'paste'}" active-class="active" class="nav-link">Paste</NuxtLink>
                <!--                <NuxtLink :to="{name: 'builds'}" active-class="active" class="nav-link">Builds</NuxtLink>-->
                <!--                <NuxtLink :to="{name: 'wiki'}" active-class="active" class="nav-link">Wiki</NuxtLink>-->
                <NuxtLink v-if="user?.role === 'admin'" :to="{name: 'admin'}" active-class="active" class="nav-link">Admin
                </NuxtLink>
            </div>

            <div class="nav-button nav-side">
                <div v-if="user" id="user-menu-button"
                     aria-expanded="false" class="nav-action account-link cursor-pointer relative" data-dropdown-placement="bottom-end"
                     data-dropdown-toggle="user-dropdown">Account
                </div>
                <NuxtLink v-else class="nav-action" exact-active-class="lmWixQ" to="/login">Login</NuxtLink>

                <div v-if="user"
                     id="user-dropdown"
                     :class="[!background ? 'bg-white divide-gray-100': 'bg-gray-700 divide-gray-600 dark:bg-white dark:divide-gray-100']"
                     class="z-50 hidden my-4 text-base list-none divide-y rounded-lg shadow">
                    <div class="px-4 py-3">
                        <span :class="[!background ? 'text-gray-900': 'text-gray-100 dark:text-black']" class="block text-sm">Hi, {{
                                user?.username
                            }} 👋</span>
                    </div>
                    <ul aria-labelledby="user-menu-button" class="py-2">
                        <li>
                            <NavPopupItem :background="background"
                                          :icon="darkMode ? 'lightbulb' : 'moon'"
                                          :label="darkMode ? 'Switch to light mode' : 'Switch to dark mode'"
                                          @click.prevent="switchTheme()"/>
                        </li>
                        <li>
                            <NavPopupItem :background="background" :to="{name: 'account'}" icon="gear" label="Settings" type="link"/>
                        </li>
                        <li>
                            <NavPopupItem :background="background" icon="right-from-bracket" label="Sign out" @click.prevent="this.logoutUser()"/>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped>

</style>