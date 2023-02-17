<template>
    <SearchForm v-if="config.search" @callbackSearch="getList"></SearchForm>
    <el-table ref="table" :border="true" :data="table_data.data" style="width: 100%"
        @selection-change="handlerSelectionChange" :row-key="config.row_key" :default-expand-all="config.expand_all">
        <el-table-column v-if="config.selection" type="selection" width="55"></el-table-column>
        <template v-for="header in data.render_header" :key="header.prop">
            <el-table-column v-if="header.type === 'switch'" :label="header.label" :width="header.width">
                <template #default="scope">
                    <Switch :data="scope.row" :config="header" />
                </template>
            </el-table-column>
            <el-table-column v-else-if="header.type === 'function'" :label="header.label" :width="header.width">
                <template #default="scope">
                    <div v-html="header.callback && header.callback(scope.row)"></div>
                </template>
            </el-table-column>
            <el-table-column v-else-if="header.type === 'slot'" :label="header.label" :width="header.width">
                <template #default="scope">
                    <slot :name="header.slot_name" :data="scope.row"></slot>
                    <el-button v-if="header.delete_elem" size="small"
                        @click="handlerDelete('delete', scope.row)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column v-else :prop="header.prop" :label="header.label" :width="header.width"></el-table-column>
        </template>
    </el-table>
    <el-row class="margin-top-30">
        <el-col :span="6">
            <el-button v-if="config.batch_delete" :disabled="!table_data.data_id"
                @click="handlerDelete('batch')">批量删除</el-button>
        </el-col>
        <el-col :span="18">
            <Pagination v-if="config.pagination" @sizeChange="getList" @currentChange="getList"
                :total="table_data.total" />
        </el-col>
    </el-row>
</template>

<script>
import { reactive, onBeforeMount, watch } from 'vue';
import { configHook } from './configHook';
import { requestHook } from "./requestHook";
import Pagination from "@/components/pagination";
import Switch from "@/components/switch";
import SearchForm from "@/components/search";
import { useStore } from "vuex";

export default {
    name: 'TableComponents',
    components: {
        Pagination,
        Switch,
        SearchForm
    },
    props: {
        columns: {
            type: Array,
            default: () => ([])
        },
        config: {
            type: Object,
            default: () => ({})
        },
        request: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ["onload"],
    setup(props, { emit }) {
        const store = useStore();
        watch(() => store.state.app.table_action_request, () => {
            config.action_request && getList();
        })

        const { config, configInit } = configHook();
        const { table_data, requestData, handlerDeleteConfirm, saveDataId } = requestHook();
        const data = reactive({
            table_data: [],
            render_header: props.columns,
            currentPage: 0,
            total: 0,
            row_data_id: "",
        });

        const getList = (params, type) => {
            requestData(params, type).then(response => {
                emit("onload", table_data);
            });
        }

        const handlerDelete = (type, val) => {
            if (type === "delete") {
                saveDataId(val);
            }
            handlerDeleteConfirm();
        }

        const handlerSelectionChange = (val) => {
            saveDataId(val);
        }

        onBeforeMount(() => {
            // 处理默认配置选项
            configInit(props.config);
            // 请求数据初始化
            getList(props.request);
        })

        return {
            data,
            config,
            table_data,
            getList,
            handlerSelectionChange,
            handlerDelete
        }
    }
}
</script>