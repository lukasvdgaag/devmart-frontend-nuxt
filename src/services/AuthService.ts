import axios, {AxiosResponse} from "axios";

export const authClient = axios.create({
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true
});

export default {
    async login(payload: any): Promise<AxiosResponse> {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.post("/login", payload);
    },
    logout() {
        return authClient.post("/logout");
    },
    getAuthUser() {
        return authClient.get("/api/user");
    },
    async registerUser(payload: any, discordAuthToken: string) {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.post(`/register${discordAuthToken ? `?discord_auth_token=${discordAuthToken}` : ''}`, payload);
    }
}