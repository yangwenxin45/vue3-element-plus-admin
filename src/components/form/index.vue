<template>
    <el-form :label-width="label_width" :model="field" ref="formDom" v-loading="loading" element-loading-text="加载中，请稍候">
        <el-row>
            <template v-for="item in form_item" :key="item.prop">
                <template v-if="!form_hidden[item.prop]">
                    <el-col :span="item.col || 24">
                        <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules">
                            <template v-if="item.type === 'cascader'">
                                <Cascader :disabled="form_disabled[item.prop]" v-model:value="field[item.prop]"
                                    :url="item.url" :cascader-props="item.props" />
                            </template>
                            <template v-if="item.type === 'input'">
                                <el-input :disabled="form_disabled[item.prop]" v-model="field[item.prop]"
                                    :maxlength="item.max_length" :minlength="item.min_length"
                                    :style="`width: ${item.width}`" :placeholder="item.placeholder"
                                    :type="item.value_type" />
                            </template>
                            <template v-if="item.type === 'upload'">
                                <UploadFile :disabled="form_disabled[item.prop]" v-model:image-url="field[item.prop]" />
                            </template>
                            <template v-if="item.type === 'radio'">
                                <template v-if="!item.options && item.callback && item.callback(item)">
                                </template>
                                <el-radio-group v-else :disabled="form_disabled[item.prop]" v-model="field[item.prop]"
                                    @change="handlerChange($event, item)">
                                    <el-radio v-for="radio in item.options" :key="radio[item.key_value] || radio.value"
                                        :label="radio[item.key_value] || radio.value">{{
                                            radio[item.key_label] || radio.label
                                        }}</el-radio>
                                </el-radio-group>
                            </template>
                            <template v-if="item.type === 'date'">
                                <el-date-picker :disabled="form_disabled[item.prop]" v-model="field[item.prop]"
                                    :type="item.date_type || 'datetime'"
                                    :format="item.date_format || 'YYYY-MM-DD HH:mm:ss'"
                                    :placeholder="item.placeholder || '选择日期时间'"
                                    :start-placeholder="item.start_placeholder || '请选择开始日期'"
                                    :end-placeholder="item.end_placeholder || '请选择结束日期'"
                                    :range-separator="item.range_placeholder || '-'">
                                </el-date-picker>
                            </template>
                            <template v-if="item.type === 'wangeditor'">
                                <Wangeditor :disabled="form_disabled[item.prop]" v-model:content="field[item.prop]" />
                            </template>
                            <template v-if="item.type === 'select'">
                                <el-select :disabled="form_disabled[item.prop]" v-model="field[item.prop]">
                                    <el-option v-for="select in item.options" :key="select.value" :label="select.label"
                                        :value="select.value"></el-option>
                                </el-select>
                            </template>
                            <template v-if="item.type === 'checkbox'">
                                <el-checkbox-group :disabled="form_disabled[item.prop]" v-model="field[item.prop]">
                                    <el-checkbox v-for="checkbox in item.options" :label="checkbox.value"
                                        :key="checkbox.value">{{
                                            checkbox.label
                                        }}</el-checkbox>
                                </el-checkbox-group>
                            </template>
                            <template v-if="item.type === 'inputNumber'">
                                <el-input-number :disabled="form_disabled[item.prop]" v-model="field[item.prop]"
                                    :min="item.min || 0" :max="item.max || 99999999"></el-input-number>
                            </template>
                            <template v-if="item.type === 'slot'">
                                <slot :name="item.slot_name"></slot>
                            </template>
                        </el-form-item>
                    </el-col>
                </template>
            </template>
        </el-row>
        <!-- button -->
        <el-form-item v-if="form_button && form_button.length > 0">
            <el-button v-for="item in form_button" :key="item.key" :type="item.type"
                @click="item.callback ? item.callback() : handlerFormActive(item)">
                {{ item.label }}
            </el-button>
        </el-form-item>

    </el-form>
</template>

<script>
import { reactive, ref } from 'vue';
import Cascader from "@c/cascader";
import UploadFile from "@c/upload";
import Wangeditor from "@c/wangeditor";
// hook
import { rulesHook } from "./hook/rulesHook";
import { relationHook } from './hook/relationHook';

export default {
    name: 'BasisForm',
    components: {
        Cascader, UploadFile, Wangeditor,
    },
    props: {
        item: {
            type: Array,
            default: () => ([])
        },
        button: {
            type: Array,
            default: () => ([])
        },
        labelWidth: {
            type: [String, Number],
            default: "100px"
        },
        field: {
            type: Object,
            default: () => ({})
        },
        hidden: {
            type: Object,
            default: () => ({})
        },
        disabled: {
            type: Object,
            default: () => ({})
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ["callback"],
    setup(props, { emit }) {
        const { InitRules } = rulesHook();
        // 校验规则处理
        const form_item = reactive(InitRules(props.item));
        const label_width = ref(props.labelWidth);
        const form_button = reactive(props.button);
        const form_hidden = reactive(props.hidden);
        const form_disabled = reactive(props.disabled);

        const { HiddenItem, DisabledItem } = relationHook();
        const handlerChange = (event, data) => {
            HiddenItem(event, data.relation_hidden, form_hidden);
            DisabledItem(event, data.relation_disabled, form_disabled);
        }

        // form表单动作
        const formDom = ref();
        const handlerFormActive = (data) => {
            // 提交表单事件
            if (data.key === 'submit') {
                formDom.value.validate((valid) => valid && emit("callback"));
            }
            // 重置表单事件
            if (data.key === 'reset') {
                handlerFormReset();
            }
        }
        const handlerFormReset = () => {
            formDom.value.resetFields();
        }

        return {
            form_item,
            label_width,
            form_button,
            form_hidden,
            form_disabled,
            formDom,
            handlerChange,
            handlerFormActive,
            handlerFormReset
        }
    }
}
</script>

<style lang="scss" scoped>

</style>