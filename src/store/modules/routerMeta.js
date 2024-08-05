import { defineStore } from "pinia";
import { store } from "@/store";

export const useRouterMetaStore = defineStore({
	id: "router-meta",
	state: () => ({
		isShowBar: true,
		title: ''//标题
	}),
	actions: {
		// 判断标题栏是否显示
		setBar(view) {
			this.isShowBar = view;
		},
		// 判断标题栏是否显示
		setTitle(view) {
			this.title = view;
		}
	}
});

export function useRouterMetaStoreHook() {
	return useRouterMetaStore(store);
}
