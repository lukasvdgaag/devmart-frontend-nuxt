import PageableRestResponse from "@/models/rest/PageableRestResponse.ts";
import Plugin from "@/models/plugin/Plugin.ts"

export default interface PluginListResponse extends PageableRestResponse {

    plugins: Array<Plugin>;

}