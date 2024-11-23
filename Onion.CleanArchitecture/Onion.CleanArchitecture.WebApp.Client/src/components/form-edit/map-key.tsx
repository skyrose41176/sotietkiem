export const MapKeyValue = (form: any, data: any) => {
  form.map((item: any) => {
    for (const key in data) {
      if (data?.[key] !== undefined) {
        item?.setFieldValue(key, data[key]);
      }
    }
  });
};
