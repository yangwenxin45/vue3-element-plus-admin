<template>
    <BasisTable :columns="table_config.table_header" :config="table_config.config" :request="table_config.request">
        <template v-slot:operation="slotData">
            <el-button type="danger" @click="handlerDialog(slotData.data.role_id)">编辑</el-button>
            <el-button type="danger" @click="handlerPassword(slotData.data.id)">修改密码</el-button>
        </template>
    </BasisTable>
    <DialogUser v-model:flag="dialogFlag" :rowId="row_id"></DialogUser>
    <DialogPass v-model:flag="dialogPassFlag" v-model:row-id="row_id" title="修改密码" />
</template>

<script>
import { reactive, provide, toRefs } from 'vue';
import BasisTable from "@/components/table";
import globalData from '@/js/data';
import DialogUser from "./components/dialogUser";
import DialogPass from "./components/dialogPassword";

export default {
    name: "SystemUser",
    components: {
        BasisTable, DialogUser, DialogPass
    },
    props: {},
    setup(props) {
        const data = reactive({
            dialogFlag: false,
            dialogPassFlag: false,
            row_id: ""
        });

        const table_config = reactive({
            table_header: [
                {
                    label: "用户名",
                    prop: "username"
                },
                {
                    label: "真实姓名",
                    prop: "truename"
                },
                {
                    label: "角色类型",
                    prop: "role_type"
                },
                {
                    label: "账号状态",
                    prop: "user_disabled",
                    type: "switch",
                    key_id: "id",
                    api_module: "user",
                    api_key: "status"
                },
                {
                    label: "创建时间",
                    prop: "user_createtime"
                },
                {
                    label: "操作",
                    type: "slot",
                    slot_name: "operation",
                    width: "280",
                    delete_elem: true
                }
            ],
            request: {
                url: "user",
                data: {
                    pageNumber: 1,
                    pageSize: 10,
                },
                delete_key: "id"
            }
        });

        const search_config = reactive({
            label_width: "70px",
            form_button_group: [
                {
                    label: "添加用户",
                    type: "danger",
                    callback: () => handlerDialog()
                }
            ],
            form_button: {
                reset_button: true
            },
            form_item: [
                {
                    type: "select",
                    label: "是否禁用",
                    prop: "user_disabled",
                    options: globalData.whether
                },
                {
                    type: "keyword",
                    label: "关键字",
                    prop: "keyword",
                    options: [
                        {
                            label: "用户名",
                            value: "username"
                        },
                        {
                            label: "真实姓名",
                            value: "truename"
                        },
                        {
                            label: "角色类型",
                            value: "role_type"
                        }
                    ]
                }
            ],
            form_data: {
                user_disabled: ""
            }
        });
        provide("search_config", search_config);

        const handlerDialog = (id = "") => {
            data.row_id = id;
            data.dialogFlag = true;
        }

        const handlerPassword = (id) => {
            data.row_id = id;
            data.dialogPassFlag = true;
        }

        return {
            table_config,
            handlerDialog,
            handlerPassword,
            ...toRefs(data),
        }
    }
}
</script>
<style lang="scss" scoped>

</style>