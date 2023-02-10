<template>
    <el-cascader v-model="data.value" :options="data.options" :props="data.props" @change="handlerChange"></el-cascader>
</template>

<script>
import { reactive, onBeforeMount, watch } from "vue";
import { CommonApi } from "@/api/common";
import ApiUrl from "@/api/requestUrl";

export default {
    name: "BasisCascader",
    components: {},
    props: {
        cascaderProps: {
            type: Object,
            default: () => ({})
        },
        url: {
            type: String,
            default: ""
        },
        method: {
            type: String,
            default: "post"
        },
        data: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: [String, Number],
            default: 0
        }
    },
    emits: ["update:value"],
    setup(props, { emit }) {
        const data = reactive({
            props: props.cascaderProps,
            options: [],
            value: 0
        });

        watch(() => props.value, (newValue) => data.value = newValue)

        const getData = () => {
            const url = ApiUrl?.cascader?.[props.url]?.url;
            const method = ApiUrl?.cascader?.[props.url]?.method || "post";
            if (!url) {
                throw new Error("URL地址不存在");
            }
            const request_data = {
                url,
                method,
                data: props.data,
            }
            CommonApi(request_data).then(response => {
                data.options = response.data;
            })
        }

        const handlerChange = (value) => {
            const val = value.length != 0 ? value[value.length - 1] : "";
            emit("update:value", val);
        }

        onBeforeMount(() => {
            getData();
        })

        return {
            data,
            handlerChange
        }
    }
}
</script>