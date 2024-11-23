import { Renderlabel } from "@components/form-edit/render-label";
import { Form, Input, Switch } from "antd";
import React from "react";
export const FormProduct: React.FC<{
  formProps: any;
  isEdit?: boolean;
  changedFields?: any;
  onFinish?: () => void;
  handleFieldsChange?: (changedFields: any, allFields: any) => void;
}> = ({
  formProps,
  isEdit = false,
  handleFieldsChange,
  changedFields,
  onFinish,
}) => {
  const onChange = (checked: boolean) => {
    formProps.form?.setFieldValue("Status", checked);
  };
  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        Status: true,
      }}
      onValuesChange={handleFieldsChange}
    >
      {isEdit && (
        <Form.Item label="ID" name="Id" hidden>
          <Input />
        </Form.Item>
      )}
      <Form.Item
        label={Renderlabel(
          isEdit,
          "Tên",
          changedFields?.includes("TenProduct")
        )}
        name="TenProduct"
        rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={Renderlabel(isEdit, "Mã", changedFields?.includes("MaProduct"))}
        name="MaProduct"
        rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={Renderlabel(
          isEdit,
          "Ghi chú",
          changedFields?.includes("GhiChu")
        )}
        name="GhiChu"
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label={Renderlabel(
          isEdit,
          "Trạng thái",
          changedFields?.includes("Status")
        )}
        name="Status"
      >
        <Switch defaultChecked onChange={onChange} />
      </Form.Item>
    </Form>
  );
};
