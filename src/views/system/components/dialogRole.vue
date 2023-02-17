<template>
    <el-dialog :title="title" v-model="dialogVisible" :width="width" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="dialogClose" @open="dialogOpen">
        <BasisForm ref="basisFormRef" label-width="100px" :item="form_config.form_item"
            :button="form_config.form_button" :field="form_config.form_data" @callback="handlerSubmit"
            :loading="form_config.form_loading">
            <template v-slot:permit>
                <el-tree ref="treeRef" :data="datas.tree_data" node-key="menu_id" :props="{ label: 'menu_name' }"
                    :expand-on-click-node="false" show-checkbox default-expand-all />
            </template>
        </BasisForm>
        <!-- <el-tree ref="treeRef" :data="datas.tree_data" node-key="menu_id" :props="{ label: 'menu_name' }"
            :expand-on-click-node="false" show-checkbox default-expand-all /> -->
    </el-dialog>
</template>

<script setup>
import { ref, reactive, defineProps, watch, defineEmits, nextTick } from "vue";
import globalData from "@/js/data";
import BasisForm from "@/components/form";
import { MenuListTree, MenuList } from "@/api/menu";
import { RoleCreate, RoleDetailed, RoleUpdate } from "@/api/role";
import { useStore } from "vuex";
import { formatRequestData, formatTree } from "@/utils/format";

const store = useStore();
const props = defineProps({
    flag: {
        type: Boolean,
        default: false
    },
    width: {
        type: String,
        default: "30%"
    },
    title: {
        type: String,
        default: "消息"
    },
    rowId: {
        type: [String, Number],
        default: ""
    }
});

const dialogVisible = ref(props.flag);
watch(() => props.flag, (newValue, oldValue) => {
    dialogVisible.value = newValue;
});
const width = ref(props.width);
const title = ref(props.title);
const datas = reactive({
    tree_data: [],
    check_list: []
});
const basisFormRef = ref(null);
const treeRef = ref(null);
const emit = defineEmits(["update:flag"]);

const form_config = reactive({
    form_item: [
        {
            type: "input",
            label: "角色名称",
            prop: "role_name",
            required: true
        },
        {
            type: "input",
            label: "角色标识",
            prop: "role_value",
            required: true,
        },
        {
            type: "radio",
            label: "是否启用",
            prop: "role_disabled",
            options: globalData.whether
        },
        {
            type: "slot",
            label: "角色权限",
            prop: "role_permit",
            slot_name: "permit"
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
        role_name: "",
        role_value: "",
        role_disabled: "1"
    },
    form_loading: false
});

const dialogOpen = async () => {
    try {
        await getMenuList();
    } catch {
        console.log("权限数据请求失败");
    }
    props.rowId && getDetailed();
    title.value = props.rowId ? "编辑角色" : "添加角色";
}
const getMenuList = () => {
    // if (datas.tree_data.length !== 0) {
    //     return false;
    // }
    return new Promise((resolve, reject) => {
        MenuList().then(response => {
            let response_data = response.data.data;
            datas.tree_data = formatTree(response_data, "menu_id", "parent_id", "children", 0);
            resolve();
        })
    })
}
const getDetailed = () => {
    form_config.form_loading = true;
    RoleDetailed({ role_id: props.rowId }).then(response => {
        const response_data = response.data;
        // 表单数据赋值
        form_config.form_data = formatRequestData(response_data, form_config.form_data);
        nextTick(() => {
            // 菜单复选框赋值
            const menu_id = response_data.menu_id || [];
            menu_id.length > 0 && menu_id.forEach(item => {
                const node = treeRef.value.getNode(item);
                node.isLeaf && treeRef.value.setChecked(node, true);
            });
        })
        form_config.form_loading = false;
    }).catch(error => {
        form_config.form_loading = false;
    })
}

const dialogClose = () => {
    console.log(treeRef);
    basisFormRef.value.handlerFormReset();
    treeRef.value.setCheckedKeys([]);
    dialogVisible.value = false;
    emit("update:flag", false);
}

const handlerSubmit = () => {
    props.rowId ? handlerEdit() : handlerAdd();
}
const handlerAdd = () => {
    const request_data = formatRequest();
    console.log("请求参数", request_data);
    form_config.form_loading = true;
    RoleCreate(request_data).then(response => {
        form_config.form_loading = false;
        store.commit("app/SET_TABLE_REQUEST");
        dialogClose();
    }).catch(error => {
        form_config.form_loading = false;
    })
}
const handlerEdit = () => {
    const request_data = formatRequest();
    form_config.form_loading = true;
    RoleUpdate(request_data).then(response => {
        form_config.form_loading = false;
        store.commit("app/SET_TABLE_REQUEST");
        dialogClose();
    }).catch(error => {
        form_config.form_loading = false;
    })
}
const formatRequest = () => {
    const id = treeRef.value.getCheckedKeys().concat(treeRef.value.getHalfCheckedKeys());
    const request_data = {
        ...form_config.form_data,
        menu_id: id
    }
    if (props.rowId) {
        request_data.role_id = props.rowId;
    }
    return request_data;
}

</script>

<style lang="scss" scoped>

</style>