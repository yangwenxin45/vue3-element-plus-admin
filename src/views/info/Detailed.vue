<template>
    <BasisForm :item="form_config.form_item" :button="form_config.form_button" label-width="120px"
        :field="form_config.form_data" @callback="handlerSubmitForm" :hidden="form_config.form_hidden" />

    <el-form :model="field" label-width="150px" ref="formDom" :rules="form_rules">
        <el-form-item label="信息类别：" prop="category_id">
            <el-cascader v-model="field.category_id" :options="category_data.category_options"
                :props="data.cascader_props"></el-cascader>
        </el-form-item>
        <el-form-item label="信息标题：" prop="title">
            <el-input v-model="field.title"></el-input>
        </el-form-item>
        <el-form-item label="缩略图：" prop="image_url">
            <el-upload class="avatar-uploader" action="#" :http-request="handlerUpload"
                :before-upload="handlerBeforeOnUpload" :show-file-list="false">
                <img v-if="field.image_url" :src="field.image_url" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                </el-icon>
            </el-upload>
        </el-form-item>
        <el-form-item label="发布日期：" prop="create_date">
            <el-date-picker v-model="field.create_date" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="内容：" prop="content">
            <div style="border: 1px solid #ccc">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                    :mode="mode" />
                <Editor style="height: 500px; overflow-y: hidden;" v-model="field.content" :defaultConfig="editorConfig"
                    :mode="mode" @onCreated="handleCreated" @onChange="handleChange" />
            </div>
        </el-form-item>
        <el-form-item label="是否发布：" prop="status">
            <el-radio-group v-model="field.status">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="danger" @click="handlerSubmitForm">确定</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeMount, onBeforeUnmount, ref, reactive, toRefs, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { useStore } from "vuex";
import { useRouter, useRoute } from 'vue-router';
import { categoryHook } from "@/hook/infoHook";
import { UploadFile } from "@/api/common";
import { InfoCreate, GetDetailed, InfoEdit } from "@/api/info";
import BasisForm from "@/components/form";

export default {
    name: 'InfoDetailed',
    components: { Editor, Toolbar, BasisForm },
    props: {},
    setup(props) {
        const store = useStore();
        const { go } = useRouter();
        const { query } = useRoute();
        const { infoData: category_data, handlerGetCategory: getList } = categoryHook();
        const data = reactive({
            row_id: query.id,
            cascader_props: {
                label: "category_name",
                value: "id"
            }
        });
        const form_data = reactive({
            field: {
                image_url: "",
                category_id: "",
                title: "",
                create_date: "",
                content: "",
                status: "1"
            },
            form_rules: {
                category_id: [{ type: "cascader", required: true, message: "分类不能为空", trigger: 'change' }],
                title: [{ type: "input", required: true, message: "标题不能为空", trigger: 'change' }],
                image_url: [{ type: "upload", required: true, message: "缩略图不能为空", trigger: 'change' }],
                create_date: [{ type: "date", required: true, message: "请选择发布日期", trigger: 'change' }],
                status: [{ type: "radio", required: true, message: "请选择发布状态", trigger: 'change' }],
                content: [{ type: "wangeditor", required: true, message: "内容不能为空", trigger: 'change' }]
            }
        });

        const handlerBeforeOnUpload = (file) => {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                ElMessage.error("上传图片只能是JPG格式！");
                return false;
            }
            if (!isLt2M) {
                ElMessage.error("上传图片大小不能超过2MB！");
                return false;
            }
            return true;
        }

        const handlerUpload = (params) => {
            console.log(params);
            const file = params.file;
            const form = new FormData();
            form.append("files", file);
            UploadFile(form).then(response => {
                form_data.field.image_url = response.data.files_path;
            })
        }

        const formDom = ref();
        const handlerSubmitForm = () => {
            formDom.value.validate(valid => {
                if (valid) {
                    data.row_id ? handlerEditInfo() : handlerAddInfo();
                } else {
                    console.log('error submit!!');
                }
            })
        }

        const handlerAddInfo = () => {
            const request_data = JSON.parse(JSON.stringify(form_data.field));
            request_data.category_id = request_data.category_id[request_data.category_id.length - 1];
            console.log(request_data);
            InfoCreate(request_data).then(response => {
                ElMessage({
                    message: response.message,
                    type: "success"
                });
                go(-1); // 返回上一页
            })
        }

        const handlerEditInfo = () => {
            const request_data = JSON.parse(JSON.stringify(form_data.field));
            if (typeof request_data.category_id !== "string") {
                request_data.category_id = request_data.category_id[request_data.category_id.length - 1];
            }
            console.log(request_data);
            InfoEdit(request_data).then(response => {
                ElMessage({
                    message: response.message,
                    type: "success"
                });
                go(-1); // 返回上一页
            })
        }

        // 编辑器实例，必须用 shallowRef
        const editorRef = shallowRef();

        const toolbarConfig = {}
        const editorConfig = { placeholder: '请输入内容...' }

        // 组件销毁时，也及时销毁编辑器
        onBeforeUnmount(() => {
            const editor = editorRef.value
            if (editor == null) return
            editor.destroy()
        })

        const handleCreated = (editor) => {
            editorRef.value = editor // 记录 editor 实例，重要！
        }

        const handleChange = (editor) => {
            // form_data.field.content = editor.getHtml();
        }

        const handlerGetDetailed = () => {
            GetDetailed({ id: data.row_id }).then(response => {
                const response_data = response.data;
                form_data.field = response_data;
                form_config.form_data = response_data;
                // editor.setHtml(response_data.content);
            })
        }

        // 组件化
        const form_config = reactive({
            form_item: [
                {
                    label: "信息分类",
                    prop: "category_id",
                    type: "cascader",
                    props: {
                        label: "category_name",
                        value: "id"
                    },
                    url: "category",
                },
                {
                    label: "信息标题",
                    prop: "title",
                    placeholder: "请输入标题",
                    type: "input",
                    // width: "300px",
                    // max_length: 50,
                    // min_length: 1,
                    // required: true,
                    // message: "请务必填写标题",
                    // rule: [
                    //     { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'change' }
                    // ]
                },
                {
                    label: "缩略图",
                    prop: "image_url",
                    type: "upload"
                },
                {
                    label: "发布日期",
                    prop: "create_date",
                    type: "date",
                    data_type: "date",
                    date_format: "YYYY-MM-DD HH:mm:ss",
                    date_value: "YYYY-MM-DD HH:mm:ss"
                },
                {
                    label: "是否发布",
                    prop: "status",
                    type: "radio",
                    options: [
                        {
                            value: "1",
                            label: "是"
                        },
                        {
                            value: "0",
                            label: "否"
                        }
                    ],
                    // relation_hidden: [
                    //     ['title', { "1": true, "0": true }],
                    //     ['image_url', { "1": true }],
                    // ],
                    // relation_disabled: [
                    //     ['title', { "0": true }]
                    // ]
                },
                {
                    label: "内容描述",
                    prop: "content",
                    type: "wangeditor"
                }
            ],
            form_button: [
                {
                    label: "提交",
                    type: "danger",
                    key: "submit"
                },
                {
                    label: "重置",
                    type: "primary",
                    key: "reset"
                },
                {
                    label: "关闭",
                    type: "primary",
                    key: "close",
                    callback: () => handlerClose()
                }
            ],
            form_data: {
                category_id: "",
                title: "",
                image_url: "",
                create_date: "",
                status: "1",
                content: ""
            },
            form_hidden: {
                category_id: true
            },

        })

        onBeforeMount(() => {
            getList();
            data.row_id && handlerGetDetailed();
        })

        return {
            ...toRefs(form_data),
            data,
            category_data,
            handlerBeforeOnUpload,
            handlerUpload,
            formDom,
            handlerSubmitForm,

            editorRef,
            mode: 'default', // 或 'simple'
            toolbarConfig,
            editorConfig,
            handleCreated,
            handleChange,

            form_config
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

:deep(.avatar-uploader .el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
    border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
