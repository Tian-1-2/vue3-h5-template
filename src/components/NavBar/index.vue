<script setup>
import { useDarkMode, useToggleDarkMode } from "@/hooks/useToggleDarkMode";
import { useRouterMetaStoreHook } from "@/store/modules/routerMeta";
import { computed } from "vue";
const onClickRight = () => {
  useToggleDarkMode();
};
const title = computed(() => {
  return useRouterMetaStoreHook().title;
});
</script>

<template>
  <van-nav-bar fixed placeholder @click-right="onClickRight" :title="title">
    <template #right>
      <svg-icon class="text-[18px]" :name="useDarkMode() ? 'light' : 'dark'" />
    </template>
  </van-nav-bar>
</template>

<style scoped></style>
