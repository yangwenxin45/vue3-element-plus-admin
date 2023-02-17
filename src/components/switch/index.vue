<template>
    <el-switch v-model="init_data.value" :loading="init_data.loading" @change="handlerSwitch($event)">
    </el-switch>
</template>

<script>
import { reactive, watch } from 'vue';
import { Status } from "@/api/info";
import ApiUrl from "@/api/requestUrl";
import { SwitchStatus } from "@/api/common";

export default {
    name: "SwitchComponent",
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        config: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props) {
        const config = reactive(props.config);
        const data = reactive(props.data);
        const init_data = reactive({
            value: data[config.prop],
            loading: false
        });
        watch(() => props.data, (newValue) => init_data.value = newValue[config.prop])

        const handlerSwitch = (value) => {
            console.log(value);
            init_data.loading = true;
            // 单独使用Switch组件，或者集成在BasisTable列表组件中
            const url = config.api_url || ApiUrl?.[config.api_module]?.[config.api_key]?.url;
            const method = config.method || ApiUrl?.[config.api_module]?.[config.api_key]?.method || "post";
            const key_id = config.key_id || "id";
            if (!url) {
                throw new Error("URL地址不存在");
            }
            init_data.value = !init_data.value;
            const request_data = {
                url,
                method,
                data: {
                    [key_id]: data[key_id],
                    [config.prop]: value
                }
            }
            return new Promise((resolve, reject) => {
                SwitchStatus(request_data).then(response => {
                    ElMessage({
                        message: response.message,
                        type: "success"
                    });
                    init_data.value = value;
                    init_data.loading = false;
                    resolve(true);
                }).catch(error => {
                    init_data.loading = false;
                    reject(false);
                })
                resolve(true);
            })

        }

        return {
            config,
            init_data,
            handlerSwitch
        }
    }
}
</script>