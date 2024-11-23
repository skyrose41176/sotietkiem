import React from "react";
import { Form, Input, InputNumber } from "antd";
export const FormProduct: React.FC<{ formProps: any; isEdit?: boolean }> = ({
  formProps,
  isEdit = false,
}) => {
  return (
    <Form {...formProps} layout="vertical">
      {isEdit && (
        <Form.Item label="ID" name="Id" hidden>
          <Input />
        </Form.Item>
      )}
      <Form.Item
        label="Name"
        name="Name"
        rules={[
          { required: true, message: "Please input your product name!" },
          {
            min: 3,
            message: "Product name must be at least 3 characters long!",
          },
          {
            max: 255,
            message: "Product name must be at most 255 characters long!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Barcode" name="Barcode">
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="Description">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Rate" name="Rate">
        <Input />
      </Form.Item>
      <Form.Item label="Price" name="Price">
        <InputNumber
          style={{ width: "100%" }}
          accept="number"
          defaultValue={0}
          required={true}
        />
      </Form.Item>
    </Form>
  );
};
