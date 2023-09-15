import AuthService from "@/services/AuthService";
import {defineStore} from "pinia";
import User from "@/models/user/User";
import {AccountTheme} from "@/models/user/AccountTheme";

export const useAuth = defineStore({
    id: "authStore",
    state: () => ({
        user: null as User | null,
        loaded: false,
        error: null as any,
    }),

    actions: {
        async login(payload: { username: string, password: string }) {
            try {
                this.loaded = false;
                return await AuthService.login(payload);
            } catch (error: any) {
                return error.response;
            }
        },
        async logout() {
            try {
                await AuthService.logout();
                this.user = null;
                if (this.$nuxt) {
                    this.$nuxt.$router.push({name: 'login'})
                }
            } catch (error) {
                this.user = null;
                this.error = error;
            }
        },
        async getAuthUser(force = false) {
            if (!force && this.loaded) return this.user;
            try {
                const res = await AuthService.getAuthUser();
                this.user = User.fromJson(res.data.data);
                this.loaded = true;
                return this.user;
            } catch (error) {
                this.user = null;
                this.loaded = true;
                this.error = error;
                return error;
            }
        },
        applyTheme(theme: AccountTheme | undefined = undefined) {
            if (!theme) theme = this.user?.theme ?? AccountTheme.System;

            if (theme === AccountTheme.System) {
                theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? AccountTheme.Dark : AccountTheme.Light
            }

            if (theme === AccountTheme.Dark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    },

    getters: {
        loggedIn: (state) => !!state.user,
        isAdmin: (state) => (state.user ? state.user.isAdmin : false),
    }
});
