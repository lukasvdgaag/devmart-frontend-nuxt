import {PasteVisibility} from "@/models/paste/PasteVisibility.ts";
import {PasteStyle} from "@/models/paste/PasteStyle.ts";

export default class Paste {

    id: number;
    name: string;
    creator: number;
    creator_username?: string;
    title: string;
    style?: PasteStyle;
    visibility?: PasteVisibility;
    lifetime?: string; // TODO: add paste lifetime enum?
    expire_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    content?: string;

    constructor(json: Record<string, any>) {
        this.id = json?.id;
        this.name = json?.name;
        this.creator = json?.creator;
        this.creator_username = json?.creator_username;
        this.title = json?.title;
        this.style = PasteStyle[json?.style as keyof typeof PasteStyle];
        this.visibility = PasteVisibility[json?.visibility as keyof typeof PasteVisibility];
        this.lifetime = json?.lifetime;
        this.expire_at = json.expire_at ? new Date(json.expire_at) : undefined;
        this.created_at = json.created_at ? new Date(json.created_at) : undefined;
        this.content = json?.content;
    }

}