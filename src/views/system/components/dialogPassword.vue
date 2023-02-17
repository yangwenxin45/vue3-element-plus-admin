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
import BasisForm from "@/components/form";
import { useStore } from "vuex";
import { propsType, dialogHook } from "@/hook/dialogHook.js";
import sha1 from "js-sha1";
import { UpdatePass } from "@/api/user";

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
            label: "密码",
            prop: "password",
            width: "300px",
            required: true,
            value_type: "password"
        },
    ],
    form_button: [
        {
            label: "确认修改",
            type: "danger",
            key: "submit"
        }
    ],
    form_data: {
        password: ""
    },
    form_loading: false
});

const dialogOpen = () => { }

const dialogClose = () => {
    close(basisFormRef);
    dialogVisible.value = false;
}

const handlerSubmit = () => {
    if (!props.rowId) {
        return false;
    }
    form_config.form_loading = true;
    UpdatePass({
        password: sha1(form_config.form_data.password),
        id: props.rowId
    }).then(response => {
        form_config.form_loading = false;
        ElMessage({
            message: response.message,
            type: "success"
        });
        dialogClose();
    }).catch(error => {
        form_config.form_loading = false;
    })
}

</script>

<style lang="scss" scoped>

</style>