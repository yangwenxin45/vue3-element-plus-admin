import { reactive } from "vue";
import { GetCategory } from "@/api/info";

/** 自定义Hook */
export function categoryHook() {
  const infoData = reactive({
    category_options: [],
  });

  const handlerGetCategory = () => {
    GetCategory().then((response) => {
      infoData.category_options = response.data;
    });
  };

  return {
    infoData,
    handlerGetCategory,
  };
}
