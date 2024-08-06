import { pageDefaultTitle } from "@/settings";
import { useRouterMetaStoreHook } from "@/store/modules/routerMeta";
export default function setPageTitle(meta) {
  //标题栏是否显示
  useRouterMetaStoreHook().setBar(meta.isBar);
  useRouterMetaStoreHook().setTitle(meta.title);
  window.document.title = meta.title
    ? `${meta.title} | ${pageDefaultTitle}`
    : `${pageDefaultTitle}`;
}
