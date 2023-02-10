<template>
    <el-upload class="avatar-uploader" action="#" :http-request="handlerUpload" :before-upload="handlerBeforeOnUpload"
        :show-file-list="false">
        <img v-if="data.image_url" :src="data.image_url" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </el-upload>
</template>

<script>
import { reactive, getCurrentInstance, watch } from 'vue';
import { UploadFile } from "@/api/common";

export default {
    name: "BasisUpload",
    components: {},
    props: {
        imageUrl: {
            type: String,
            default: ""
        }
    },
    emits: ["update:imageUrl"],
    setup(props, { emit }) {
        const data = reactive({
            image_url: props.imageUrl
        });

        watch(() => props.imageUrl, (newValue) => {
            data.image_url = newValue;
        })

        const handlerBeforeOnUpload = async (file) => {
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

        const handlerUpload = async (params) => {
            const file = params.file;
            const form = new FormData();
            form.append("files", file);
            try {
                const url = await startUpload(form);
                data.image_url = url;
                emit("update:imageUrl", url);
            } catch {
                console.log("上传失败");
            }
        }

        const startUpload = (form) => {
            return new Promise((resolve, reject) => {
                UploadFile(form).then(response => {
                    resolve(response.data.files_path);
                })
            })
        }

        return {
            data,
            handlerBeforeOnUpload,
            handlerUpload
        }
    }
}
</script>

<style lang='scss' scoped>
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