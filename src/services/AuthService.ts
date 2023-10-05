import axios, { AxiosResponse } from 'axios';
import { LoginBody } from '@/interfaces/LoginBody';
import { API_AUTH_URL, API_BASE_URL, LARAVEL_URL } from '@/constants/api';

export const authClient = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

export default {
    async requestCsrfToken(): Promise<void> {
        await authClient.get(`${LARAVEL_URL}/sanctum/csrf-cookie`);
    },
    async login(payload: LoginBody): Promise<AxiosResponse> {
        await this.requestCsrfToken();
        // TODO: Fix cookies not able to be stored on localhost because of 127.0.0.1 and localhost mismatch.
        return authClient.post(`${API_AUTH_URL}/login`, payload);
    },
    logout() {
        return authClient.post(`${API_AUTH_URL}/logout`);
    },
    getAuthUser() {
        return authClient.get(`${API_BASE_URL}/user`);
    },
    async registerUser(payload: any, discordAuthToken: string) {
        await this.requestCsrfToken();
        return authClient.post(`${API_AUTH_URL}/register${discordAuthToken ? `?discord_auth_token=${discordAuthToken}` : ''}`, payload);
    }
};
