<script setup>
// import { useDarkMode, useToggleDarkMode } from "@/hooks/useToggleDarkMode";
import { useRouterMetaStoreHook } from "@/store/modules/routerMeta";
import { computed } from "vue";
const onClickRight = () => {
  // useToggleDarkMode();
};
const title = computed(() => {
  return useRouterMetaStoreHook().title;
});
const onClickLeft=()=>{
  window.history.go(-1)
}
</script>

<template>
  <van-nav-bar fixed placeholder @click-right="onClickRight" :title="title">
    <template #right>
      <!-- <svg-icon class="text-[18px]" :name="useDarkMode() ? 'light' : 'dark'" /> -->
    </template>
    <template #left>
        <van-icon
          name="arrow-left"
          color="#fff"
          size="20"
          @click="onClickLeft"
        />
      </template>
  </van-nav-bar>
</template>

<style scoped lang="less">
::v-deep .van-nav-bar__content {
  background: #3589A9;
  .van-nav-bar__title {
      color: #fff;
      font-weight: 500;
  }
}
</style>
