<template>
    <el-container id="layout-container" direction="horizontal">
        <el-aside id="layout-aside" width="250px">
            <LayoutAside />
        </el-aside>
        <el-container>
            <el-header id="layout-header" height="75px">
                <LayoutHeader />
            </el-header>
            <el-main id="layout-main">
                <LayoutMain />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import LayoutAside from './components/Aside.vue';
import LayoutHeader from './components/Header.vue';
import LayoutMain from './components/Main.vue';

export default {
    name: "Layout",
    components: {
        LayoutAside, LayoutHeader, LayoutMain
    },
    props: {},
    setup() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
#layout-container {
    height: 100vh;
}

#layout-aside {
    background-color: #344a5f;
}

#layout-header {
    background-color: #77bc99;
}

#layout-main {
    background-color: #bc77a1;
}
</style>