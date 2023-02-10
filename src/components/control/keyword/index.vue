<template>
    <el-select v-model="key" placeholder="请选择" class="key-word-select" @change="handlerChange">
        <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
    <el-input v-model="value" :placeholder="placeholder" class="width-200" v-on:input="callback"></el-input>
</template>

<script>
import { reactive, toRefs } from 'vue';

export default {
    name: "KeyWord",
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ["callback"],
    setup(props, { emit }) {
        const data = reactive({
            key: "",
            value: "",
            placeholder: "请输入搜索的关键字",
            options: props.data.options
        })

        const handlerChange = (value) => {
            data.value = "";
            updatePlaceholder();
            callback();
        }

        const updatePlaceholder = () => {
            const item = data.options.filter(item => item.value === data.key)[0];
            data.placeholder = `请输入${item.label}`;
        }

        const callback = () => {
            emit("callback", {
                type: 'keyword',
                value: {
                    key: data.key,
                    value: data.value
                },
                formItem: props.data
            })
        }

        const handlerClear = () => {
            data.key = "";
            data.value = "";
        }

        return {
            ...toRefs(data),
            handlerChange,
            callback,
            handlerClear
        }
    }
}
</script>

<style lang="scss" scoped>
.key-word-select {
    width: 100px;
    margin-right: 10px;
}

.width-200 {
    width: 200px;
}
</style>