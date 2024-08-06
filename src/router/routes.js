import Layout from "@/layout/index.vue";
import Index from "@/views/index/index.vue";

const routes = [
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: { name: "Index" },
    children: [
      {
        path: "index",
        name: "Index",
        component: Index,
        meta: {
          title: "主页",
          isBar: false
        }
      },
      {
        path: "tools",
        name: "Tools",
        component: () => import("@/views/tools/index.vue"),
        meta: {
          title: "工具",
          isBar: true
        }
      },
      {
        path: "about",
        name: "About",
        component: () => import("@/views/about/index.vue"),
        meta: {
          title: "关于",
          noCache: true,
          isBar: true
        }
      },
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/login/login.vue"),
        meta: {
          title: "登录",
          noCache: true,
          isBar: false
        }
      }
    ]
  }
];

export default routes;
