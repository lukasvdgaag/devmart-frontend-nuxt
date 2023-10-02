import axios from 'axios/index';
import { AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/constants/api.ts';
import User from '@/models/user/User.ts';
import { PasteListResponse } from '@/models/rest/paste/PasteListResponse.ts';
import { UserListResponse } from '@/models/rest/user/UserListResponse.ts';
import { UserPaypalInformation } from '@/models/rest/user/UserPaypalInformation.ts';
import { UserDiscordInformation } from '@/models/rest/user/UserDiscordInformation.ts';

export const client = axios.create({
    baseURL: `${API_BASE_URL}/users`,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

export default {
    async fetchUserById(userId: number): Promise<User | null> {
        try {
            const res = await client.get(`/${userId}`);
            return User.fromJson(res.data.user);
        } catch (e) {
            return null;
        }
    },
    async findUsersByQuery(query: string = '', page: number = 1, perPage: number = 15): Promise<UserListResponse | null> {
        try {
            const res = await axios.get(client.defaults.baseURL as string, {
                params: {
                    query,
                    page,
                    perPage
                }
            });

            return {
                users: res.data.users.map(User.fromJson),
                total: res.data.total,
                currentPage: res.data.currentPage,
                pages: res.data.pages
            };
        } catch (e) {
            console.error(e);
            return null;
        }
    },
    async findUsersByUsername(username: string): Promise<User[]> {
        try {
            const res = await client.get('/search', {
                params: {
                    username
                }
            });
            return res.data.users.map(User.fromJson);
        } catch (e) {
            return [];
        }
    },
    async updateUserById(userId: number, payload: User) {
        const res = await client.put(`/${userId}`, JSON.stringify(payload));
        return User.fromJson(res.data);
    },
    async fetchUserPayPalById(userId: number) {
        return await client.get(`/${userId}/paypal`);
    },
    async updateUserPayPalById(userId: number, payload: UserPaypalInformation): Promise<AxiosResponse> {
        return await client.put(`/${userId}/paypal`, JSON.stringify(payload));
    },
    async fetchDiscordInformation(discordId: number): Promise<UserDiscordInformation | null> {
        try {
            const res = await client.get(`${API_BASE_URL}/discord/user/${discordId}`);
            return res.data;
        } catch (e) {
            return null;
        }
    },
    async fetchUserPastesById(userId: number, query: string = '', page: number = 1): Promise<PasteListResponse> {
        const res = await client.get(`/${userId}/pastes`, {
            params: {
                query,
                page
            }
        });

        return {
            total: res.data.total,
            currentPage: res.data.currentPage,
            pages: res.data.pages,
            pastes: res.data.pastes
        };
    }
};
