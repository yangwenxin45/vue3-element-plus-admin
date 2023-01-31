<template>
    <div id="login">
        <div class="form-wrap">
            <ul class="menu-tab">
                <template v-for="item in tab_menu" :key="item.type">
                    <li @click="toggleMenu(item.type)" :class="{ current: current_menu === item.type }">{{
                        item.label
                    }}</li>
                </template>
            </ul>
            <el-form :model="form" :rules="rules" ref="account_form">
                <el-form-item prop="username">
                    <label class="form-label">用户名</label>
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <label class="form-label">密码</label>
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item v-if="current_menu === 'register'" prop="passwords">
                    <label class="form-label">确认密码</label>
                    <el-input type="password" v-model="form.passwords"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <label class="form-label">验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="14">
                            <el-input v-model="form.code"></el-input>
                        </el-col>
                        <el-col :span="10">
                            <el-button type="success" class="el-button-block" @click="handleGetCode"
                                :disabled="code_button_disabled">{{ code_button_text }}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" class="el-button-block" :disabled="submit_button_disabled"
                        :loading="submit_button_loading" @click="submitForm">{{ current_menu
                        === "login" ? "登录" : "注册"
                        }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, reactive, toRefs, getCurrentInstance } from 'vue';
import { validate_email } from '../../utils/validate';
import { GetCode, ErrorHttp } from '@/api/common';
import { Register, Login } from '@/api/account';
import sha1 from 'js-sha1';
import { useStore } from "vuex";
import router from '@/router';

export default {
    name: "Login",
    components: {},
    props: {},
    setup(props) {
        const store = useStore();

        // 用户名校验
        const validate_name_rules = (rule, value, callback) => {
            let regEmail = validate_email(value);
            if (value === '') {
                callback(new Error('请输入邮箱'))
            } else if (!regEmail) {
                callback(new Error('邮箱格式不正确'))
            } else {
                callback()
            }
        }

        const regPassword = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;

        const validate_password_rules = (rule, value, callback) => {
            // 获取“确认密码”
            const passwordsValue = data.form.passwords;
            if (value === '') {
                callback(new Error("请输入密码"));
            } else if (!regPassword.test(value)) {
                callback(new Error("请输入>=6并且<=20位的密码，包含数字、字母"));
            } else {
                callback();
            }
        }
        // 校验确认密码
        const validate_passwords_rules = (rule, value, callback) => {
            // 获取“密码”
            const passwordValue = data.form.password;
            if (value === '') {
                callback(new Error("请输入密码"));
            } else if (!regPassword.test(value)) {
                callback(new Error("请输入>=6并且<=20位的密码，包含数字、字母"));
            } else if (passwordValue && passwordValue !== value) {
                callback(new Error("两次密码不一致"));
            } else {
                callback();
            }
        }
        const validate_code_rules = (rule, value, callback) => {
            const regCode = /^[a-z0-9]{6}$/;
            if (value === '') {
                callback(new Error("请输入验证码"));
            } else if (!regCode.test(value)) {
                callback(new Error("请输入6位的验证码"));
            } else {
                data.submit_button_disabled = false;
                callback();
            }
        }

        const data = reactive({
            tab_menu: [
                {
                    type: "login",
                    label: "登录"
                },
                {
                    type: "register",
                    label: "注册"
                }
            ],
            current_menu: "login",
            form: {
                username: "",      // 用户名
                password: "",      // 密码
                passwords: "",     // 确认密码
                code: "",          // 验证码
            },
            rules: {
                username: [
                    { validator: validate_name_rules, trigger: 'change' }
                ],
                password: [
                    { validator: validate_password_rules, trigger: 'change' }
                ],
                passwords: [
                    { validator: validate_passwords_rules, trigger: 'change' }
                ],
                code: [
                    { validator: validate_code_rules, trigger: 'change' }
                ]
            },
            code_button_disabled: false,
            code_button_text: "获取验证码",
            code_button_timer: null,
            submit_button_disabled: true,
            submit_button_loading: false
        })

        const toggleMenu = (type) => {
            data.current_menu = type
        }

        // 获取验证码
        const handleGetCode = () => {
            const username = data.form.username;
            const password = data.form.password;
            const passwords = data.form.passwords;

            if (username === '' || !validate_email(username)) {
                ElMessage({
                    message: '用户名不能为空或格式不正确',
                    type: "error"
                })
                return false;
            }

            if (password === '' || !regPassword.test(password)) {
                ElMessage({
                    message: '密码不能为空或格式不正确',
                    type: "error"
                })
                return false;
            }

            if (data.current_menu === 'register' && password !== passwords) {
                ElMessage({
                    message: "两次密码不一致",
                    type: 'error'
                })
                return false;
            }

            data.code_button_disabled = true;
            data.code_button_text = "发送中";

            // 获取验证码接口
            const requestData = {
                username: data.form.username,
                module: data.current_menu
            }
            GetCode(requestData).then(response => {
                console.log(response);
                const result = response;
                ElMessage({
                    message: result.message,
                    type: "success"
                })
                data.submit_button_disabled = false;
                // 倒计时
                countdown();
            }).catch(error => {
                data.code_button_disabled = false;
                data.code_button_text = "获取验证码";
            })
        }

        const countdown = (second = 60) => {
            data.code_button_text = `倒计时${second}秒`;
            if (data.code_button_timer) {
                clearInterval(data.code_button_timer);
            }
            data.code_button_timer = setInterval(() => {
                second--;
                data.code_button_text = `倒计时${second}秒`;
                if (second <= 0) {
                    data.code_button_text = '重新获取';
                    data.code_button_disabled = false;
                    clearInterval(data.code_button_timer)
                }
            }, 1000)
        }

        const account_form = ref(null);
        const submitForm = (formName) => {
            account_form.value.validate((valid) => {
                if (valid) {
                    data.current_menu === "login" ? login() : register();
                }
            })
        }

        const register = () => {
            const requestData = {
                username: data.form.username,
                password: sha1(data.form.password),
                code: data.form.code
            }
            data.submit_button_loading = true;
            Register(requestData).then(response => {
                ElMessage({
                    message: response.message,
                    type: "success"
                });
                // 重置元素
                reset();
            }).catch(error => {
                data.submit_button_loading = false;
            })
        }

        const login = () => {
            const requestData = {
                username: data.form.username,
                password: sha1(data.form.password),
                code: data.form.code
            }
            data.submit_button_loading = true;
            // Login(requestData).then(response => {
            //     ElMessage({
            //         message: response.message,
            //         type: "success"
            //     })
            //     reset();
            // }).catch(error => {
            //     data.submit_button_loading = false;
            // })
            store.dispatch("app/loginAction", requestData).then(response => {
                ElMessage({
                    message: response.message,
                    type: "success"
                });
                // store.commit('app/SET_TOKEN', response.data.token);
                // store.commit('app/SET_USERNAME', response.data.username);
                // 路由跳转
                router.push({
                    path: "/console"
                });
                reset();
            }).catch(error => {
                data.submit_button_loading = false;
            })
        }

        const reset = () => {
            account_form.value.resetFields();
            data.current_menu = "login";
            data.code_button_timer && clearInterval(data.code_button_timer);
            data.code_button_text = "获取验证码";
            data.code_button_disabled = false;
            data.submit_button_disabled = true;
            data.submit_button_loading = false;
        }

        return {
            ...toRefs(data),
            toggleMenu,
            handleGetCode,
            submitForm,
            account_form
        }
    }
}
</script>

<style lang="scss" scoped>
#login {
    height: 100vh; // 设置高度，可视区高度100%
    background-color: #344a5f; // 设置背景颜色
}

// :deep(.el-form-item__content) {
//     display: block;
// }

.form-wrap {
    width: 320px; // 设置宽度
    padding-top: 100px; // 上内边距
    margin: auto; // 块元素水平居中
}

.menu-tab {
    text-align: center;

    li {
        display: inline-block;
        padding: 10px 24px;
        margin: 0 10px;
        color: #fff;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;

        &.current {
            background-color: rgba(0, 0, 0, .1);
        }
    }
}

.form-label {
    display: block;
    color: #fff;
    font-size: 14px;
}
</style>