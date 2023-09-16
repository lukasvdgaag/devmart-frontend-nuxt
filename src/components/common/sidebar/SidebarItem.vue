<template>
  <NuxtLink v-if="item.renderRequirements"
                 :class="{
                  'sidebar-active hover:bg-gray-300 dark:hover:bg-gray-600': isActive(item),
                  'lg:mr-3': marginRight,
                  'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700': highlight,
                  'hover:bg-gray-100 dark:hover:bg-gray-800': !isActive(item) && !highlight,
                  'hover:bg-gray-200 dark:hover:bg-gray-700': !isActive(item) && highlight,
               }" :to="item.link" active-class=""
                 class="py-3 px-4 my-2 rounded-lg flex flex-row items-center plain"
                 exact-active-class="">
        <div v-if="item.icon" class="preview-link-icon flex justify-center">
            <font-awesome-icon :icon="item.icon"/>
        </div>
        <div class="preview-link-title">{{ item.label }}</div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import {defineProps} from 'vue';
import {useRoute} from 'vue-router';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import SidebarItem from "@/models/components/SidebarItem.ts";

export interface Props {
    item: SidebarItem,
  links?: SidebarItem[],
    marginRight?: boolean,
    highlight?: boolean
}

const {links} = withDefaults(defineProps<Props>(), {
    marginRight: true,
    highlight: false,
})

const route = useRoute();

const isDefault = (item: SidebarItem) => {
    if (!links) return true;
    const def = links.find((link) => link.isDefault);
    if (!def || def !== item) return false;

    return links.filter((l) => isActive(l, false)).length === 0;
};

const isActive = (item: SidebarItem, checkForDefault = true) => {
    if (item.activeRequirements) return true;
    if (checkForDefault && isDefault(item)) return true;

    if ('name' in item.link && route.matched.filter((i) => i.name === item.link.name).length === 0) return false;
    if ('query' in item.link) {
        for (const key in item.link.query) {
          if (route.query[key] !== item.link.query[key]) return false;
        }
    }
    return true;
};
</script>
