import { useAuth } from '@/store/authStore.ts';

export default async function () {
    const user = await useAuth().getAuthUser();
    console.log(user);
};
