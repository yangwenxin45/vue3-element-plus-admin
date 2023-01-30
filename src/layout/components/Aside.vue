<template>
    <h1 class="logo">
        <img :src="logo" alt="统一报名缴费平台" />
    </h1>
    <el-menu :default-active="currentPath" background-color="#344a5f" text-color="#fff" active-text-color="#ffffff"
        router>
        <template v-for="item in routers" :key="item.path">
            <template v-if="!item.hidden">
                <!-- 一级菜单 -->
                <template v-if="hasOnlyChild(item.children)">
                    <el-menu-item :index="item.children[0].path">
                        <!-- <img class="menu-icon" :src="item.meta.icon" alt=""> -->
                        <svg-icon :icon-name="item.meta && item.meta.icon" class-name="aside-menu-svg"></svg-icon>
                        <template #title>{{ item.children[0].meta && item.children[0].meta.title }}</template>
                    </el-menu-item>
                </template>
                <!-- 子级菜单 -->
                <template v-else>
                    <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
                        <template #title>
                            <!-- <img class="menu-icon" :src="item.meta && item.meta.icon" alt=""> -->
                            <svg-icon :icon-name="item.meta && item.meta.icon" class-name="aside-menu-svg"></svg-icon>
                            <span>{{ item.meta && item.meta.title }}</span>
                        </template>
                        <template v-for="child in item.children" :key="child.path">
                            <el-menu-item v-if="!child.hidden" :index="child.path">{{
                                child.meta && child.meta.title
                            }}</el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
            </template>
        </template>
    </el-menu>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { reactive, toRefs, computed } from "vue";

export default {
    name: "Aside",
    components: {},
    props: {},
    setup() {
        const { options } = useRouter();
        const routers = options.routes;
        const { path } = useRoute();

        // 判断是否只要一个子级菜单
        const hasOnlyChild = (children) => {
            if (!children) {
                return false;
            }
            // 过滤掉hidden属性为true的路由存储路由
            const childRouter = children.filter(item => {
                return item.hidden ? false : true;
            })
            if (childRouter.length === 1) {
                return true;
            }
            return false;
        }

        // 获取当前路由
        const currentPath = computed(() => path);

        const data = reactive({
            logo: require("@/assets/images/logo.png")
        })

        return {
            ...toRefs(data),
            routers,
            hasOnlyChild,
            currentPath
        }
    }
}
</script>

<style lang="scss" scoped>
.logo {
    padding: 20px 0;
    border-bottom: 1px solid #2d4153;

    img {
        margin: auto;
    }
}
</style>