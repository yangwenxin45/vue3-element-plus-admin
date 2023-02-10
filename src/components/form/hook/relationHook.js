export function relationHook() {
  const HiddenItem = (value, data, props) => {
    if (data && Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        const field = item[0];
        const objValue = item[1];
        props[field] = objValue[value];
      });
    }
  };

  const DisabledItem = (value, data, props) => {
    if (data && Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        const field = item[0];
        const objValue = item[1];
        props[field] = objValue[value];
      });
    }
  };

  return {
    HiddenItem,
    DisabledItem,
  };
}
