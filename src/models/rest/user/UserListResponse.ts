import PageableRestResponse from "@/models/rest/PageableRestResponse.ts";
import User from "@/models/user/User.ts";

export default interface UserListResponse extends PageableRestResponse {

    users: Array<User>;

}