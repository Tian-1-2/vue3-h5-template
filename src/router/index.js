import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import { useCachedViewStoreHook } from "@/store/modules/cachedView";
import NProgress from "@/utils/progress";
import setPageTitle from "@/utils/set-page-title";
import { getToken } from '@/utils/auth'
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
const whiteList = ['/login', '/register'];
router.beforeEach((to, from, next) => {
  NProgress.start();
  // 路由缓存
  useCachedViewStoreHook().addCachedView(to);
  // 页面 title
  setPageTitle(to.meta);
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next();
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      if (Object.entries(to.query).length > 0) {
        next()
      } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      }
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
