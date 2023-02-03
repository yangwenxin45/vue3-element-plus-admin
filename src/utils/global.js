const globalFunction = {};

/**
 * @param { message } String 内容，可选
 * @param { title } String 标题，可选
 * @param { thenFun } Function 回调函数，可选
 * @description 确认弹窗
 */
globalFunction.deleteConfirm = (params) => {
  ElMessageBox.confirm(
    params.message || "确认删除当前数据吗？删除后将无法恢复",
    params.title || "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      showClose: false, // 取消右上角关闭按钮
      closeOnClickModal: false, // 取消点击遮罩关闭 MessageBox
      closeOnPressEscape: false, // 取消按下ESC键关闭MessageBox
      type: "warning",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          // 判断thenFun存在并且是Function类型，是则自动执行函数
          const is_function =
            params.thenFun &&
            Object.prototype.toString.call(params.thenFun) ===
              "[object Function]";

          if (is_function) {
            // 按钮加载状态
            instance.confirmButtonLoading = true;
            params
              .thenFun()
              .then(() => {
                instance.confirmButtonLoading = false;
                done();
              })
              .catch(() => {
                instance.confirmButtonLoading = false;
                done();
              });
          }
        } else {
          done();
        }
      },
    }
  )
    .then(() => {})
    .catch(() => {});
};

globalFunction.message = (params) => {
  console.log(params);
};

export default {
  install(app) {
    app.config.globalProperties["deleteConfirm"] = globalFunction.deleteConfirm;
    app.config.globalProperties["message"] = globalFunction.message;
  },
};
