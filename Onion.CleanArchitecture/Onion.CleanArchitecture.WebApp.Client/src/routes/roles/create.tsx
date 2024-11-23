import { Create, useForm } from "@refinedev/antd";
import { Role } from "./types";
import { Form, Input } from "antd";
import { errorNotificationComponent } from "@components/notifications/errorNotification";
import { Button } from "antd/lib";

export const CreateRole = () => {
  const { formProps, saveButtonProps } = useForm<Role>({
    redirect: "list",
    successNotification: {
      message: `Thêm mới nhóm quyền thành công`,
      type: "success",
      description: "Thành công",
    },
    errorNotification(error) {
      return errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi");
    },
  });
  const renderFooterCreateRole = () => {
    return (
      <Button {...saveButtonProps} type="primary">
        Tạo
      </Button>
    );
  };
  return (
    <Create
      resource="roles"
      title="Nhóm Quyền"
      footerButtons={renderFooterCreateRole}
      saveButtonProps={saveButtonProps}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label="Tên" name="Name" className="form-custom">
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};
