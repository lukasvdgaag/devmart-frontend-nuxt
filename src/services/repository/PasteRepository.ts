import axios from "axios";
import PasteListResponse from "@/models/rest/paste/PasteListResponse.ts";
import Paste from "@/models/paste/Paste.ts";
import {PasteCreateBody} from "@/models/rest/paste/PasteCreateBody.ts";
import {API_BASE_URL} from "@/constants/api.ts";

export const client = axios.create({
    baseURL: `${API_BASE_URL}/paste`,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true
});

export default {

    /**
     * Fetch a list of recently created/updated pastes.
     * @param page The page to fetch.
     * @param perPage The number of pastes per page.
     */
    async fetchRecentPastes(page: number = 1, perPage: number = 8): Promise<PasteListResponse> {
        const res = await axios.get(client.defaults.baseURL as string, {
            params: {page, perPage}
        });

        const data = res.data;

        let pastes: Paste[] = [];
        for (const paste of res.data.pastes) {
            pastes.push(new Paste(paste));
        }

        return {
            total: data.total,
            currentPage: data.currentPage,
            pages: data.pages,
            pastes
        }
    },

    /**
     * Create a new paste
     * @param body The paste data.
     * @return Promise<Paste> The created paste.
     */
    async createPaste(body: PasteCreateBody): Promise<Paste> {
        try {
            const res = await axios.post(client.defaults.baseURL as string, body);

            return new Paste(res.data);
        } catch (e) {
            throw e;
        }
    },

    /**
     * Update a paste by its ID.
     * @param pasteId The ID of the paste to update.
     * @param body The new paste data.
     * @return Promise<Paste> The updated paste.
     */
    async updatePaste(pasteId: string, body: PasteCreateBody): Promise<Paste> {
        try {
            const res = await client.put(`/${pasteId}`, body);
            return new Paste(res.data);
        } catch (e) {
            throw e;
        }
    },

    /**
     * Deletes a paste by its ID.
     * @param pasteId The ID of the paste to delete.
     * @returns boolean Whether the paste was deleted successfully.
     */
    async deletePaste(pasteId: string): Promise<boolean> {
        try {
            const res = await client.delete(`/${pasteId}`);
            return res.status === 200;
        } catch (e) {
            throw e;
        }
    },

    /**
     * Fetch a paste by its ID.
     * @param pasteId The ID of the paste to fetch.
     * @returns Promise<Paste> The fetched paste.
     */
    async fetchPaste(pasteId: string): Promise<Paste> {
        const res = await client.get(`/${pasteId}`);
        return new Paste(res.data);
    }

}