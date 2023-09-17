import axios from 'axios'
import {useCookie} from "nuxt/app";
import {LARAVEL_URL} from "@/constants/api.ts";

export default async function () {
    const cookie = useCookie('XSRF-TOKEN')

    if (!cookie.value) {
        try {
            await axios.get(`${LARAVEL_URL}/sanctum/csrf-cookie`, {withCredentials: true})
        } catch (error) {
            console.error('Error getting CSRF cookie:', error)
        }
    }
}
