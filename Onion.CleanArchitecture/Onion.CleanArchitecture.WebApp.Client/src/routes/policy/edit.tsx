import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
export const EditPolicies = () => {
  const { formProps, saveButtonProps } = useForm<any>({
    redirect: "list",
  });
  return (
    <Edit
      resource="policy"
      title="Edit Policy"
      saveButtonProps={saveButtonProps}
    >
      <Form {...formProps} layout="vertical" className="form-custom">
        <Form.Item label="Role" name="Role">
          <Input />
        </Form.Item>
        <Form.Item label="PolicyName" name="Resource">
          <Input />
        </Form.Item>
        <Form.Item label="Action" name="Action">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
