import { pageDefaultTitle } from "@/settings";
import { useRouterMetaStoreHook } from "@/store/modules/routerMeta";
export default function setPageTitle(routerTitle) {
  useRouterMetaStoreHook().setTitle(routerTitle);
  window.document.title = routerTitle
    ? `${routerTitle} | ${pageDefaultTitle}`
    : `${pageDefaultTitle}`;
}
