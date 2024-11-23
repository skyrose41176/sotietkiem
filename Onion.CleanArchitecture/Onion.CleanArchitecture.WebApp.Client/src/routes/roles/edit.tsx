import { Edit, useForm } from "@refinedev/antd";
import { Role } from "./types";
import { Form, Input } from "antd";
import { errorNotificationComponent } from "@components/notifications/errorNotification";

export const EditRole = () => {
  const { formProps, saveButtonProps } = useForm<Role>({
    redirect: "edit",
    successNotification: {
      message: `Cập nhật nhóm quyền thành công`,
      type: "success",
      description: "Thành công",
    },
    errorNotification(error) {
      return errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi");
    },
  });
  return (
    <Edit
      resource="roles"
      title="Chỉnh sửa nhóm quyền"
      saveButtonProps={saveButtonProps}
      headerButtons={() => false}
      canDelete={false}
    >
      <Form {...formProps} layout="vertical" className="form-custom">
        <Form.Item label="ID" name="Id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên Nhóm Quyền"
          name="Name"
          rules={[
            {
              required: true,
              message: "Tên nhóm quyền bắt buộc nhập",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
