import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
    axios.defaults.withCredentials = true;
});