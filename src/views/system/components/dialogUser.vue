<template>
    <el-dialog :title="title" v-model="dialogVisible" :width="width" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="dialogClose" @open="dialogOpen">
        <BasisForm ref="basisFormRef" label-width="100px" :item="form_config.form_item"
            :button="form_config.form_button" :field="form_config.form_data" @callback="handlerSubmit"
            :loading="form_config.form_loading" :hidden="form_config.form_hidden">
        </BasisForm>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, defineProps, watch, defineEmits, nextTick } from "vue";
import globalData from "@/js/data";
import BasisForm from "@/components/form";
import { RoleListAll } from "@/api/role";
import { useStore } from "vuex";
import { propsType, dialogHook } from "@/hook/dialogHook.js";
import { UserCreate, UserDetailed } from "@/api/user";
import sha1 from "js-sha1";

const store = useStore();
const props = defineProps({
    ...propsType,
    rowId: {
        type: [String, Number],
        default: "",
    },
});
const emit = defineEmits(["update:flag"]);
const { close } = dialogHook(emit);

const dialogVisible = ref(props.flag);
watch(() => props.flag, (newValue, oldValue) => {
    dialogVisible.value = newValue;
});
const width = ref(props.width);
const title = ref(props.title);

const basisFormRef = ref(null);

const form_config = reactive({
    form_item: [
        {
            type: "input",
            label: "用户名",
            prop: "username",
            required: true,
            // value_type: "username",
        },
        {
            type: "input",
            label: "真实姓名",
            prop: "truename"
        },
        {
            type: "input",
            label: "密码",
            prop: "password",
            width: "300px",
            required: true,
            // value_type: "password"
        },
        {
            type: "radio",
            label: "是否启用",
            prop: "user_disabled",
            options: globalData.whether,
            required: true
        },
        {
            type: "radio",
            label: "角色类型",
            prop: "role_type",
            required: true,
            callback: async (row) => {
                let result = [];
                try {
                    result = await getRoleList();
                } catch (error) {
                    console.log("角色数据获取失败");
                }
                row.options = result;
            },
            key_label: "role_name",
            key_value: "role_id"
        }
    ],
    form_button: [
        {
            label: "确认提交",
            type: "danger",
            key: "submit"
        }
    ],
    form_data: {
        username: "",
        password: "",
        truename: "",
        role_type: "",
        user_disabled: "1"
    },
    form_loading: false,
    form_hidden: {}
});

const getRoleList = () => {
    return new Promise((resolve, reject) => {
        RoleListAll().then(response => {
            resolve(response.data);
        })
    })
}

const dialogOpen = () => {
    form_config.form_hidden.password = !!props.rowId;
    props.rowId && getDetailed();
    title.value = props.rowId ? "编辑用户" : "添加用户";
}
const getDetailed = () => {
    form_config.form_loading = true;
    UserDetailed({ id: props.rowId }).then(response => {
        // 表单数据赋值
        form_config.form_data = response.data;
        form_config.form_loading = false;
    }).catch(error => {
        form_config.form_loading = false;
    })
}

const dialogClose = () => {
    close(basisFormRef);
    dialogVisible.value = false;
}

const handlerSubmit = () => {
    props.rowId ? handlerEdit() : handlerAdd();
}
const handlerAdd = () => {
    form_config.form_loading = true;
    const request_data = Object.assign({}, form_config.form_data);
    request_data.password = sha1(request_data.password);
    UserCreate(request_data).then(response => {
        userResponse(response);
    }).catch(error => {
        form_config.form_loading = false;
    })
}
const handlerEdit = () => {
    form_config.form_loading = true;
    const request_data = Object.assign({}, form_config.form_data);
    delete request_data.password;
    UserUpdate({ ...request_data, id: props.rowId }).then(response => {
        userResponse(response);
    }).catch(error => {
        form_config.form_loading = false;
    })
}
const userResponse = (response) => {
    form_config.form_loading = false;
    const response_data = response.data;
    if (!response_data.user) {
        ElMessage({
            message: response.message,
            type: 'error'
        });
        return false;
    }
    ElMessage({
        message: response.message,
        type: "success"
    });
    store.commit("app/SET_TABLE_REQUEST");
    dialogClose();
}

</script>

<style lang="scss" scoped>

</style>