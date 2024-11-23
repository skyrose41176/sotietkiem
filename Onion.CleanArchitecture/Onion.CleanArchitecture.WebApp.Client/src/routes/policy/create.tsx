import { Breadcrumb, Create, useForm } from "@refinedev/antd";
import { Form, Input, notification } from "antd";

export const CreatePolicies = () => {
  const { formProps, saveButtonProps } = useForm<any>({
    redirect: "list",
  });

  const handleFinish = (values: any) => {
    const customizedData = {
      ...values,
      Permission: "p",
      Role: values.Role.trim(),
      PolicyName: values.PolicyName.trim(),
      Action: values.Action.trim(),
    };

    try {
      if (formProps.onFinish) {
        const response: any = formProps.onFinish(customizedData);

        if (response && typeof response.Succeeded !== 'undefined') {
          if (response.Succeeded) {
            notification.success({
              message: "Tạo quyền thành công",
              description: "Policy đã được tạo thành công.",
            });
          } else {
            notification.error({
              message: "Tạo quyền thất bại",
              description: response.Message || "Có lỗi xảy ra khi tạo policy.",
            });
          }
        } else {
          notification.error({
            message: "Tạo quyền thất bại",
            description: "Phản hồi không hợp lệ từ onFinish.",
          });
        }
      } else {
        throw new Error("onFinish function is undefined");
      }
    } catch (error: any) {
      notification.error({
        message: "Tạo quyền thất bại",
        description: error.message || "Có lỗi xảy ra khi tạo policy.",
      });
    }
  };

  return (
    <Create
      saveButtonProps={saveButtonProps}
      title={"Thêm Policy"}
      breadcrumb={
        <Breadcrumb
          breadcrumbProps={{
            items: [
              {
                title: "Cấu hình Policy",
                href: "/policy",
              },
              {
                title: "Thêm policy",
              },
            ],
          }}
        />
      }
    >
      <Form
        {...formProps}
        layout="vertical"
        className="form-custom"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Role"
          name="Role"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thông tin!",
            },
          ]}
        >
          <Input placeholder="Nhập vai trò" />
        </Form.Item>
        <Form.Item
          label="Policy Name"
          name="PolicyName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thông tin!",
            },
          ]}
        >
          <Input placeholder="Nhập tên policy" />
        </Form.Item>
        <Form.Item
          label="Action"
          name="Action"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thông tin!",
            },
          ]}
        >
          <Input placeholder="Nhập hành động" />
        </Form.Item>
      </Form>
    </Create>
  );
};

export default CreatePolicies;
