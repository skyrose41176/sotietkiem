import { Create, useForm } from "@refinedev/antd";
import { RoleClaim } from "./types";
import { FormContent } from "./components/form-content";
import { errorNotificationComponent } from "@components/notifications/errorNotification";
import { Button } from "antd/lib";
export const CreateRoleClaim = () => {
  const { formProps, saveButtonProps } = useForm<RoleClaim>({
    redirect: "edit",
    successNotification: {
      message: `Thêm mới vai trò thành công`,
      type: "success",
      description: "Thành công",
    },
    errorNotification(error) {
      return errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi");
    },
  });
  const renderFooterCreateRoleClaim = () => {
    return (
      <Button {...saveButtonProps} type="primary">
        Tạo
      </Button>
    );
  };
  return (
    <Create
      title="Tạo vai trò mới"
      footerButtons={renderFooterCreateRoleClaim}
      saveButtonProps={saveButtonProps}
    >
      <FormContent formProps={formProps} />
    </Create>
  );
};
