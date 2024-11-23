import { useForm, Edit } from "@refinedev/antd";
import { RoleClaim } from "./types";
import { FormContent } from "./components/form-content";
import { errorNotificationComponent } from "@components/notifications/errorNotification";
export const EditRoleClaim = () => {
  const { formProps, saveButtonProps } = useForm<RoleClaim>({
    redirect: "list",
    successNotification: {
      message: `Cập nhật thành công`,
      type: "success",
      description: "Thành công",
    },
    errorNotification(error) {
      return errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi");
    },
  });

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      title="Chỉnh sửa vai trò"
      headerButtons={() => false}
      canDelete={false}
    >
      <FormContent formProps={formProps} />
    </Edit>
  );
};
