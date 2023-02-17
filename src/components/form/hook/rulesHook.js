import { validate_email, validate_password } from "@/utils/validate";

export function rulesHook() {
  const InitRules = (data = []) => {
    if (data.length === 0) {
      return false;
    }
    // 判断是否有required属性
    data.forEach((item) => {
      //初始化规则数组
      let rulesArr = [];
      if (item.required) {
        let json = {
          required: true,
          message: item.message || messageType(item),
          trigger: "change",
        };
        rulesArr.push(json);
      }
      // 是否有其他的校验规则
      const rule = item.rule;
      if (rule && Array.isArray(rule) && rule.length > 0) {
        rulesArr = rulesArr.concat(rule);
      }
      // 用户名
      if (item.value_type === "username") {
        const rule = {
          validator(rule, value, callback, source, options) {
            if (!value || value === "") {
              callback(new Error("请输入用户名"));
            } else if (!validate_email(value)) {
              callback(new Error("邮箱格式不正确"));
            } else {
              callback();
            }
          },
        };
        rulesArr = rulesArr.concat(rule);
      }
      // 密码
      if (item.value_type === "password") {
        const rule = {
          validator(rule, value, callback, source, options) {
            if (!value || value === "") {
              callback(new Error("请输入用密码"));
            } else if (!validate_password(value)) {
              callback(new Error("请输入>=6并且<=20位的密码，包含数字、字母"));
            } else {
              callback();
            }
          },
        };
        rulesArr = rulesArr.concat(rule);
      }
      // 定义rules属性赋值
      item.rules = rulesArr;
    });
    console.log(data);
    return data;
  };

  const messageType = (data) => {
    let msg = "";
    switch (data.type) {
      case "input":
      case "wangeditor":
        msg = "请输入";
        break;
      case "upload":
        msg = "请上传";
        break;
      case "radio":
      case "checkbox":
      case "select":
      case "date":
      case "cascader":
        msg = "请选择";
        break;
      default:
        msg = "未定义";
    }
    return `${msg}${data.label}`;
  };

  return {
    InitRules,
  };
}
