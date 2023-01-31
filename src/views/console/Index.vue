<template>
    <div class="">控制台</div>
    <svg-icon :icon-name="icon"></svg-icon>
</template>

<script>
import { ref } from "vue";
import { useStore } from 'vuex';

export default {
    name: 'NewsIndex',
    components: {},
    props: {},
    setup(props) {
        const icon = ref("home");

        const store = useStore();

        return {
            icon
        }
    }
}
</script>
<style lang="scss" scoped>

</style>