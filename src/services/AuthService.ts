import axios, { AxiosResponse } from 'axios';
import { LoginBody } from '@/interfaces/LoginBody';
import { API_BASE_URL } from '@/constants/api';

export const authClient = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

export default {
    async requestCsrfToken(): Promise<void> {
        await authClient.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
    },
    async login(payload: LoginBody): Promise<AxiosResponse> {
        await this.requestCsrfToken();
        return authClient.post('/login', payload);
    },
    logout() {
        return authClient.post('/logout');
    },
    getAuthUser() {
        return authClient.get(`${API_BASE_URL}/user`);
    },
    async registerUser(payload: any, discordAuthToken: string) {
        await this.requestCsrfToken();
        return authClient.post(`/register${discordAuthToken ? `?discord_auth_token=${discordAuthToken}` : ''}`, payload);
    }
};
