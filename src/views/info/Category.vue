<template>
    <el-button type="danger" @click="handlerCategory('parent_category_add')">添加一级分类</el-button>
    <hr class="spacing-hr" />
    <el-row>
        <el-col :span="7">
            <el-tree ref="categoryTree" node-key="id" :data="data.tree_data" :props="data.defaultProps"
                default-expand-all :expand-on-click-node="false">
                <template #default="{ node, data }">
                    <div class="custom-tree-node">
                        <span>{{ node.label }}</span>
                        <span>
                            <el-button type="danger" round
                                @click="handlerCategory('child_category_add', node)">添加子级</el-button>
                            <el-button type="success" round
                                @click="handlerCategory(node.level === 1 ? 'parent_category_edit' : 'child_category_edit', node)">编辑</el-button>
                            <el-button round @click="handlerCategory('delete_category', node)">删除</el-button>
                        </span>
                    </div>
                </template>
            </el-tree>
        </el-col>
        <el-col :span="17">
            <h4 class="column">{{ config[config.type].title }}</h4>
            <el-form label-width="120px">
                <el-form-item label="父级分类名称：">
                    <el-input v-model.trim="data.parent_category" :disabled="config[config.type].parent_disabled"
                        style="width: 20%"></el-input>
                </el-form-item>
                <el-form-item label="子级分类名称：" v-if="config[config.type].sub_show">
                    <el-input v-model.trim="data.sub_category" :disabled="config[config.type].sub_disabled"
                        style="width: 20%"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" :loading="data.button_loading" @click="handlerSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
import { ref, reactive, onBeforeMount } from 'vue';
import { parentCategoryAdd, GetCategory, ChildCategoryAdd, CategoryEdit, CategoryDel } from "@/api/info";
import { ElMessage } from 'element-plus';

export default {
    name: 'InfoCategory',
    components: {},
    props: {},
    setup(props) {
        const data = reactive({
            tree_data: [],
            defaultProps: {
                children: 'children',
                label: 'category_name'
            },
            parent_category: "父级分类文本演示",
            sub_category: "子级分类文本演示",
            button_loading: false,
            parent_category_data: null,
            sub_category_data: null
        });

        const config = reactive({
            type: "default",
            default: {
                title: "分类标题",
                parent_disabled: true,
                sub_disabled: true,
                sub_show: true,
                clear: ["parent_category", "sub_category"]
            },
            parent_category_add: {
                title: "添加父级分类",
                parent_disabled: false,
                sub_disabled: true,
                sub_show: false,
                clear: ["parent_category", "sub_category"]
            },
            child_category_add: {
                title: "添加子级分类",
                parent_disabled: true,
                sub_disabled: false,
                sub_show: true,
                clear: ["sub_category"],
                create: ["parent_category"]
            },
            parent_category_edit: {
                title: "编辑父级分类",
                parent_disabled: false,
                sub_disabled: true,
                sub_show: false,
                create: ["parent_category"]
            },
            child_category_edit: {
                title: "编辑子级分类",
                parent_disabled: true,
                sub_disabled: false,
                sub_show: true,
                create: ["parent_category", "sub_category"]
            }
        });

        const categoryTree = ref(null);

        // 分类列表
        const handlerGetCategory = () => {
            GetCategory().then(response => {
                data.tree_data = response.data || [];
            });
        }

        const handlerCategory = (type, node_data) => {
            console.log(node_data);
            if (type === "child_category_edit") {
                data.sub_category_data = node_data || null;
                data.parent_category_data = node_data.parent || null;
            } else {
                data.parent_category_data = node_data || null;
            }
            config.type = type === "delete_category" ? "default" : type;
            // 文本清除、还原
            handlerInputValue();
            (type === "delete_category") && handlerDeleteConfirm();
        }

        // 删除分类
        const handlerDeleteConfirm = () => {
            ElMessageBox.confirm('确认删除该分类吗？删除后将无法恢复', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        CategoryDel({ categoryId: data.parent_category_data.data.id }).then(response => {
                            ElMessage({
                                message: response.message,
                                type: 'success',
                            });
                            instance.confirmButtonLoading = false;
                            done();
                            categoryTree.value.remove(data.parent_category_data);
                        }).catch(error => {
                            instance.confirmButtonLoading = false;
                            done();
                        })
                    } else {
                        done();
                    }
                }
            });
        }

        const handlerInputValue = () => {
            const clearObject = config[config.type].clear;
            if (clearObject && clearObject.length > 0) {
                clearObject.forEach(item => {
                    data[item] = "";
                })
            }

            const createObject = config[config.type].create;
            if (createObject && createObject.length > 0) {
                createObject.forEach(item => {
                    data[item] = data[`${item}_data`].data.category_name;
                })
            }
        }

        const handlerSubmit = () => {
            if (config.type === 'parent_category_add') {
                handlerParentCategoryAdd();
            }
            if (config.type === 'child_category_add') {
                handlerChildCategoryAdd();
            }
            if (config.type === 'child_category_edit' || config.type === 'parent_category_edit') {
                handlerCategoryEdit();
            }
        }

        // 添加父级分类
        const handlerParentCategoryAdd = () => {
            if (!data.parent_category) {
                ElMessage.error("父级分类名称不能为空");
                return false;
            }
            data.button_loading = true;
            parentCategoryAdd({ categoryName: data.parent_category }).then(response => {
                data.button_loading = false;
                ElMessage({
                    message: response.message,
                    type: 'success',
                });
                data.parent_category = "";
                handlerGetCategory();
            }).catch(error => {
                data.button_loading = false;
            })
        }

        // 添加子级分类
        const handlerChildCategoryAdd = () => {
            if (!data.sub_category) {
                ElMessage.error("子级分类名称不能为空");
                return false;
            }
            data.button_loading = true;
            ChildCategoryAdd({
                categoryName: data.sub_category,
                parentId: data.parent_category_data.data.id
            }).then(response => {
                data.button_loading = false;
                ElMessage({
                    message: response.message,
                    type: 'success',
                });
                data.sub_category = "";
                categoryTree.value.append(response.data, data.parent_category_data);
            }).catch(error => {
                data.button_loading = false;
            })
        }

        // 编辑分类
        const handlerCategoryEdit = () => {
            if (!data.parent_category) {
                ElMessage.error("父级分类名称不能为空");
                return false;
            }
            if (!data.sub_category && config.type === 'child_category_edit') {
                ElMessage.error("子级分类名称不能为空");
                return false;
            }
            data.button_loading = true;
            const node_parent = data.parent_category_data.data;
            const node_sub = data.sub_category_data.data;
            CategoryEdit({
                categoryName: config.type === "parent_category_edit" ? data.parent_category : data.sub_category,
                id: config.type === "parent_category_edit" ? node_parent.id : node_sub.id
            }).then(response => {
                data.button_loading = false;
                ElMessage({
                    message: response.message,
                    type: 'success',
                });
                const node_data = config.type === "parent_category_edit" ? node_parent : node_sub;
                node_data.category_name = response.data.category_name;
            }).catch(error => {
                data.button_loading = false;
            })
        }

        onBeforeMount(() => {
            handlerGetCategory();
        })

        return {
            data,
            config,
            handlerCategory,
            handlerSubmit,
            categoryTree
        }
    }
}
</script>

<style lang="scss" scoped>
.spacing-hr {
    border: none;
    border-top: 1px solid #e9e9e9;
    margin: 30px 0
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

:deep(.el-tree-node__content) {
    height: auto;

    button {
        padding: 6px 12px;
        margin: 8px 3px;
        font-size: 12px;
        height: auto;
    }
}

.column {
    height: 44px;
    padding: 0 20px;
    margin-bottom: 30px;
    line-height: 44px;
    border-radius: 6px;
    background-color: #f3f3f3;
}
</style>