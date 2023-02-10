<template>
    <el-pagination class="pull-right" small background @size-change="handlerSizeChange"
        @current-change="handlerCurrentChange" v-model:current-page="current_page" v-model:page-size="page_size"
        :page-sizes="[1, 10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
</template>

<script>
import { ref, watchEffect } from 'vue';

export default {
    name: "Pagination",
    props: {
        total: [Number, String],
        default: 0
    },
    emits: ["sizeChange", "currentChange"],
    setup(props, { emit }) {
        const current_page = ref(1);
        const page_size = ref(10);
        const total = ref(props.total);

        watchEffect(() => {
            total.value = props.total;
        })

        const handlerSizeChange = (val) => {
            const params = {
                pageNumer: 1,
                pageSize: val
            }
            emit("sizeChange", params, "page");
        }

        const handlerCurrentChange = (val) => {
            const params = {
                pageNumber: val
            }
            emit("currentChange", params, "page");
        }

        return {
            total,
            current_page,
            page_size,
            handlerSizeChange,
            handlerCurrentChange
        }
    }
}
</script>>