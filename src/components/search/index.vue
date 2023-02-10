<template>
    <div v-if="button_group && button_group.length > 0" class="form-search-button-group">
        <el-button v-for="item in button_group" :key="item.id" :type="item.type"
            @click="item.callback && item.callback()">
            {{ item.label }}
        </el-button>
    </div>
    <el-form :inline="true" :label-width="label_width" :model="field" ref="searchForm">
        <el-row v-if="form_item && form_item.length > 0">
            <template v-for="item in form_item" :key="item.prop">
                <el-col :span="item.col || 24">
                    <el-form-item :label="item.label" :prop="item.prop">
                        <template v-if="item.type === 'cascader'">
                            <Cascader v-model:value="field[item.prop]" :url="item.url" :cascader-props="item.props" />
                        </template>
                        <template v-if="item.type === 'input'">
                            <el-input v-model="field[item.prop]" :maxlength="item.max_length"
                                :minlength="item.min_length" :style="`width: ${item.width}`"
                                :placeholder="item.placeholder" />
                        </template>
                        <template v-if="item.type === 'upload'">
                            <UploadFile v-model:image-url="field[item.prop]" />
                        </template>
                        <template v-if="item.type === 'radio'">
                            <el-radio-group v-model="field[item.prop]" @change="handlerChange($event, item)">
                                <el-radio v-for="radio in item.options" :key="radio.value" :label="radio.value">{{
                                    radio.label
                                }}</el-radio>
                            </el-radio-group>
                        </template>
                        <template v-if="item.type === 'date'">
                            <el-date-picker v-model="field[item.prop]" :type="item.date_type || 'datetime'"
                                :format="item.date_format || 'YYYY-MM-DD HH:mm:ss'"
                                :placeholder="item.placeholder || '选择日期时间'"
                                :start-placeholder="item.start_placeholder || '请选择开始日期'"
                                :end-placeholder="item.end_placeholder || '请选择结束日期'"
                                :range-separator="item.range_placeholder || '-'">
                            </el-date-picker>
                        </template>
                        <template v-if="item.type === 'wangeditor'">
                            <Wangeditor v-model:content="field[item.prop]" />
                        </template>
                        <template v-if="item.type === 'select'">
                            <el-select v-model="field[item.prop]">
                                <el-option v-for="select in item.options" :key="select.value" :label="select.label"
                                    :value="select.value"></el-option>
                            </el-select>
                        </template>
                        <template v-if="item.type === 'checkbox'">
                            <el-checkbox-group v-model="field[item.prop]">
                                <el-checkbox v-for="checkbox in item.options" :label="checkbox.value"
                                    :key="checkbox.value">{{
                                        checkbox.label
                                    }}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                        <template v-if="item.type === 'keyword'">
                            <KeyWord :ref="componentDom" v-model="field[item.prop]" :data="item"
                                @callback="componentCallback">
                            </KeyWord>
                        </template>
                    </el-form-item>
                </el-col>
            </template>
            <!-- button -->
            <el-col :span="button_col">
                <el-form-item>
                    <el-button type="danger" @click="handlerSearch">搜索</el-button>
                    <el-button v-if="button.reset_button" @click="handlerReset">重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import { inject, ref, reactive } from 'vue';
import Cascader from "@c/cascader";
import UploadFile from "@c/upload";
import Wangeditor from "@c/wangeditor";
import KeyWord from "@/components/control/keyword";

export default {
    name: "BasisSearchForm",
    components: {
        Cascader, UploadFile, Wangeditor, KeyWord
    },
    props: {
        item: {
            type: Array,
            default: () => ([])
        },
        labelWidth: {
            type: [String, Number],
            default: ""
        },
        field: {
            type: Object,
            default: () => ({})
        },
        button: {
            type: Object,
            default: () => ({})
        },
        button_group: {
            type: Array,
            default: () => ({})
        },
        button_col: {
            type: Number,
            default: 24
        }
    },
    emits: ["callbackSearch"],
    setup(props, { emit }) {
        const search_config = inject('search_config');
        // label 占位宽度
        const label_width = ref(search_config?.label_width || props.labelWidth);
        // 配置组件元素
        const form_item = reactive(search_config?.form_item || props.item);
        // 配置字段
        const field = reactive(search_config?.form_data || props.field);
        const button = reactive(search_config?.form_button || props.button);
        const button_group = reactive(search_config?.form_button_group || props.button_group);
        const button_col = reactive(search_config?.button_col || props.button_col);

        const data = reactive({
            key: "",
            value: ""
        });
        const handlerSearch = () => {
            const data = formatRequest();
            console.log(data);
            emit("callbackSearch", data, "search");
        }

        const formatRequest = () => {
            const request_data = {};
            for (let key in field) {
                if (field[key] !== "") {
                    request_data[key] = field[key];
                }
            }
            if (data.key && data.value) {
                request_data[data.key] = data.value;
            }
            return request_data;
        }

        const componentCallback = (params) => {
            console.log(params);
            if (params.type === 'keyword') {
                data.key = params.value.key;
                data.value = params.value.value;
            }
        }

        const searchForm = ref(null);
        const keywordForm = ref(null);
        const componentDom = (el) => {
            if (el && el.data.type === 'keyword') {
                keywordForm.value = el;
            }
        }

        const handlerReset = () => {
            searchForm.value.resetFields();
            // console.log(keywordForm.value);
            keywordForm.value && keywordForm.value.handlerClear();
            emit("callbackSearch", {}, "search");
        }

        return {
            search_config,
            label_width,
            form_item,
            field,
            button,
            button_group,
            handlerSearch,
            componentCallback,
            searchForm,
            keywordForm,
            handlerReset,
            button_col,
            componentDom
        }
    }
}
</script>