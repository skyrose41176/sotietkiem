import { OpenNotificationParams } from "@refinedev/core";

export const errorNotificationComponent = (title: string) => {
  return {
    message: title,
    type: "error",
    description: "Thất bại",
  } as OpenNotificationParams;
};
