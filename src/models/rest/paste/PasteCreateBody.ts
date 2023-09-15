import {PasteStyle} from "@/models/paste/PasteStyle.ts";
import {PasteVisibility} from "@/models/paste/PasteVisibility.ts";

export interface PasteCreateBody {

    title: string;
    style: PasteStyle;
    visibility: PasteVisibility;
    lifetime: string;
    content: string;

}