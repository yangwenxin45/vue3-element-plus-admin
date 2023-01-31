<template>
    <div class="header-wrap">
        <div class="wrap">
            <span class="menu-btn" @click="switchAside">
                <svg-icon iconName="menuBtn" className="icon-menu-svg"></svg-icon>
            </span>
        </div>
        <div class="wrap">
            <div class="user-info">
                <div class="face-info">
                    <img src="../../assets/images/logo-min.png" :alt="username" />
                    <span class="name">{{ username }}</span>
                </div>
                <span class="logout" @click="handlerLogout">
                    <svg-icon iconName="logout" className="icon-logout"></svg-icon>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    name: "Header",
    components: {},
    props: {},
    setup(props) {
        const store = useStore();
        const { replace } = useRouter();

        const switchAside = (() => {
            store.commit('app/SET_COLLAPSE');
        });

        const username = ref(store.state.app.username);

        // 退出
        const handlerLogout = (() => {
            ElMessageBox.confirm('确认退出管理后台', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning"
            }).then(() => {
                store.dispatch('app/logoutAction').then(response => {
                    ElMessage({
                        message: response.message,
                        type: "success"
                    });
                    replace({
                        name: "Login"
                    })
                })
            }).catch(error => { });
        })

        return {
            switchAside,
            username,
            handlerLogout
        }
    }
};
</script>

<style lang="scss" scoped>
.header-wrap {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.menu-btn {
    cursor: pointer;
}

.icon-menu-svg {
    font-size: 24px;
}

.user-info {
    display: flex;
    align-items: center;
}

.face-info {

    span,
    img {
        display: inline-block;
        vertical-align: middle;
    }

    span {
        margin-left: 15px;
    }
}

.logout {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 75px;
    height: 75px;
    cursor: pointer;
}

.icon-logout {
    font-size: 24px;
}
</style>