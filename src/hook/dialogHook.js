export const propsType = {
  flag: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "30%",
  },
  title: {
    type: String,
    default: "消息",
  },
};

export function dialogHook(emit) {
  const close = (form) => {
    emit("update:flag", false);
    form && form.value.handlerFormReset();
  };
  return {
    close,
  };
}
