<template>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            :mode="mode" @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, watchEffect, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { getToken } from "@/utils/cookies";

export default {
    name: 'Wangeditor',
    components: {
        Editor, Toolbar
    },
    props: {
        content: {
            type: String,
            default: ""
        }
    },
    emits: ["update:content"],
    setup(props, { emit }) {
        // 编辑器实例，必须用 shallowRef
        const editorRef = shallowRef();

        const valueHtml = ref(props.content);
        watch(() => props.content, (newValue) => {
            valueHtml.value = newValue;
        })

        const toolbarConfig = {}
        const editorConfig = {
            placeholder: '请输入内容...',
            MENU_CONF: {
                uploadImage: {
                    server: process.env.VUE_APP_DEV_TARGET + '/upload',
                    fieldName: 'files',
                    headers: {
                        Token: getToken()
                    },
                    customInsert(res, insertFn) {
                        console.log(res);
                        insertFn(res.data.files_path, "上传出错", res.data.files_path);
                    }
                }
            }
        }

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
            emit("update:content", valueHtml.value);
        }

        return {
            editorRef,
            valueHtml,
            mode: 'default', // 或 'simple'
            toolbarConfig,
            editorConfig,
            handleCreated,
            handleChange,
        }
    }
}
</script>

<style lang='scss' scoped>

</style>