<template>
    <el-row>
        <el-col :span="18">
            <el-form :inline="true" lable-width="80px">
                <el-form-item label="类别">
                    <!-- <el-select v-model="data.category" placeholder="请选择" class="width-160">
                        <el-option v-for="item in data.category_options" :key="item.value" :value="item.value"
                            :label="item.label"></el-option>
                    </el-select> -->
                    <el-cascader v-model="request_data.category_id" :options="category_data.category_options"
                        :props="data.cascader_props"></el-cascader>
                </el-form-item>
                <el-form-item label="关键字">
                    <el-select v-model="request_data.key" placeholder="请选择" class="width-100">
                        <el-option v-for="item in data.keyword_options" :key="item.value" :value="item.value"
                            :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="request_data.keyword" placeholder="请输入关键字" class="width-180"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="handlerGetList">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="6">
            <router-link to="/newsDetailed">
                <el-button type="danger" class="pull-right">新增</el-button>
            </router-link>
        </el-col>
    </el-row>
    <el-table ref="table" :border="true" :data="data.tableData" style="width: 100%"
        @selection-change="handlerSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="标题" width="500"></el-table-column>
        <el-table-column prop="category_name" label="类别"></el-table-column>
        <el-table-column prop="createDate" label="日期" :formatter="formatDate"></el-table-column>
        <el-table-column prop="status" label="发布状态">
            <template #default="scope">
                <el-switch v-model="scope.row.status" @change="changeStatus($event, scope.row)"
                    :loading="scope.row.loading"></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
            <template #default="scope">
                <el-button type="danger" size="small" @click="handlerDetailed(scope.row.id)">编辑</el-button>
                <el-button size="small" @click="handlerDeleteConfirm(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-row class="margin-top-30">
        <el-col :span="6">
            <el-button :disabled="!data.row_data_id" @click="handlerDeleteConfirm(data.row_data_id)">批量删除</el-button>
        </el-col>
        <el-col :span="18">
            <el-pagination class="pull-right" small background @size-change="handlerSizeChange"
                @current-change="handlerCurrentChange" :current-page="data.current_page" :page-size="10"
                :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
                :total="data.total"></el-pagination>
        </el-col>
    </el-row>
</template>

<script>
import { onBeforeMount, reactive, getCurrentInstance } from 'vue';
import { GetTableList, Status, Delete } from "@/api/info";
import { getDate } from "@/utils/common";
import { dayjs } from 'element-plus';
import { categoryHook } from "@/hook/infoHook";
import { useRouter } from "vue-router";

export default {
    name: 'InfoIndex',
    components: {},
    props: {},
    setup(props) {
        // 获取实例上下文
        const { proxy } = getCurrentInstance();
        const { push } = useRouter();
        const { infoData: category_data, handlerGetCategory: getList } = categoryHook();
        const data = reactive({
            cascader_props: {
                label: "category_name",
                value: "id"
            },
            keyword_options: [
                {
                    label: "ID",
                    value: "id"
                },
                {
                    label: "标题",
                    value: "title"
                }
            ],
            tableData: [],
            currentPage: 1,
            total: 0,
            row_data_id: "",
        });

        const request_data = reactive({
            pageNumber: 1,
            pageSize: 10,
            category_id: [],
            key: "",
            keyword: ""
        });

        const handlerGetList = () => {
            const request_data = formatParams();
            GetTableList(request_data).then(response => {
                const response_data = response.data;
                data.tableData = response_data.data;
                data.total = response_data.total;
            })
        }
        const formatParams = () => {
            // 浅拷贝
            const data = Object.assign({}, request_data);
            if (data.category_id.length) {
                data.category_id = data.category_id[data.category_id.length - 1];
            } else {
                delete data.category_id;
            }
            if (data.key && data.keyword) {
                data[data.key] = data.keyword;
            }
            delete data.key;
            delete data.keyword;
            return data;
        }

        const formatDate = (row) => {
            return dayjs(row.createDate * 1000).format("YYYY-MM-DD HH:mm:ss");
        }

        const handlerSizeChange = (val) => {
            request_data.pageSize = val;
            request_data.pageNumber = 1;
            handlerGetList();
        }
        const handlerCurrentChange = (val) => {
            request_data.pageNumber = val;
            handlerGetList();
        }

        const changeStatus = ($event, row) => {
            row.loading = true;
            // 还原el-switch的值
            row.status = !row.status;
            Status({
                id: row.id,
                status: $event
            }).then(response => {
                ElMessage({
                    message: response.message,
                    type: "success"
                });
                row.status = $event;
                row.loading = false;
            }).catch(error => {
                row.loading = false;
            })
        }

        const handlerDeleteConfirm = (value) => {
            proxy.deleteConfirm({
                title: "删除",
                message: "确认删除当前数据吗？",
                thenFun: () => {
                    return handlerDelete(value);
                }
            });
        }

        const handlerDelete = (value) => {
            return new Promise((resolve, reject) => {
                Delete({ id: value }).then(response => {
                    ElMessage({
                        message: response.message,
                        type: 'success',
                    });
                    handlerGetList();
                    data.row_data_id = [];
                    resolve();
                }).catch(error => {
                    reject();
                })
            })
        }

        const handlerSelectionChange = (val) => {
            console.log(val);
            if (val && val.length > 0) {
                const idItem = val.map(item => item.id);
                data.row_data_id = idItem.join();
            } else {
                data.row_data_id = "";
            }
        }

        const handlerDetailed = (id) => {
            push({
                path: "/newsDetailed",
                query: { id }
            })
        }

        onBeforeMount(() => {
            handlerGetList();
            getList();
        })

        return {
            data,
            category_data,
            request_data,
            handlerGetList,
            formatDate,
            handlerSelectionChange,
            handlerSizeChange,
            handlerCurrentChange,
            changeStatus,
            handlerDeleteConfirm,
            handlerDetailed
        }
    }
}
</script>
<style lang="scss" scoped>
.width-160 {
    width: 160px;
}

.width-100 {
    width: 100px;
}

.width-180 {
    width: 180px;
}
</style>