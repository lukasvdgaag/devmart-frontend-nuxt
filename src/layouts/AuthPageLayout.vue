<script lang="ts" setup>
import Navbar from "@/components/common/navbar/Navbar.vue";
import AuthCard from "@/components/common/AuthCard.vue";
import {useAuth} from "@/store/authStore.ts";

// TODO: retrieve these from the route meta.
defineProps<{
  header: string,
  subheader: string,
}>();

// redirect to home if logged in, for login and register pages
const loggedIn = useAuth().loggedIn;
if (loggedIn) useRouter().push("/");
</script>

<template>
  <div class="flex flex-row h-full">
    <div class="w-full flex flex-col items-center m-0 p-0 h-full">
      <Navbar :background="true"/>
      <AuthCard :header="header" :subheader="subheader" class="w-full">
        <router-view/>
      </AuthCard>
    </div>
  </div>
</template>

<style scoped>

</style>