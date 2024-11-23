import dayjs from "dayjs";

export const formatDatetime = (value?: string) => {
  return value ? dayjs(value).format("DD/MM/YYYY") : "";
};
