import { useSelect } from '@refinedev/antd';
import React from 'react'
import { Form, Input, Select } from "antd";
export const FormContent: React.FC<{ formProps: any }> = ({ formProps }) => {
  const { selectProps } = useSelect({
    resource: "roles",
    optionLabel: "Name",
    optionValue: "Id",
  });
  const [form] = Form.useForm();
  return (
    <Form form={form} {...formProps} layout="vertical" className="form-custom">
      <Form.Item label="ID" name="Id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        label="Vai trò"
        name="RoleId"
        rules={[{ required: true, message: "Please select role!" }]}>
        <Select {...selectProps} />
      </Form.Item>
      <Form.Item
        label="Resource"
        name="ClaimType"
        rules={[{ required: true, message: "Please input your ClaimType!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ClaimValue"
        label="Actions"
        rules={[
          {
            required: true,
            message: "Please select action for this resource!",
            type: "array",
          },
        ]}
      >
        <Select mode="tags" placeholder="Please select favourite colors">
          <Select.Option value="list">list</Select.Option>
          <Select.Option value="create">create</Select.Option>
          <Select.Option value="show">show</Select.Option>
          <Select.Option value="edit">edit</Select.Option>
          <Select.Option value="delete">delete</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}
