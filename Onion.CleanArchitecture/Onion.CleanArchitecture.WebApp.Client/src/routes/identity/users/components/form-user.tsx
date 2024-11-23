import { Renderlabel } from "@components/form-edit/render-label";
import { dataProvider } from "@providers/data-provider";
import { useSelect } from "@refinedev/antd";
import { useNotification } from "@refinedev/core";
import { Form, Input } from "antd";
import { Button, Col, Row, Select, Space, Switch } from "antd/lib";
import React from "react";
import { IUserLdapInfo } from "../types";
export const FormUser: React.FC<{
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
  const { open: openCreateUser } = useNotification();
  const [urlAvatarCreateUser, setUrlAvatarCreateUser] =
    React.useState<string>("");
  const handleGetUserLdap = async () => {
    try {
      const username = formProps.form?.getFieldValue("UserName");
      const userLdap = await dataProvider.getUserLdap(username);
      const ldap = userLdap.data as IUserLdapInfo;
      const names = ldap.DisplayName.split(" ");
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(" ") : "";
      setUrlAvatarCreateUser(ldap.EmailAddress);
      formProps.form?.setFieldsValue({
        FirstName: firstName,
        LastName: lastName,
        Email: ldap.EmailAddress,
      });
    } catch (error) {
      openCreateUser?.({
        type: "error",
        message: (error as Error)?.message,
        undoableTimeout: 5,
      });
      setUrlAvatarCreateUser("");
      formProps.form?.setFieldsValue({
        FirstName: "",
        LastName: "",
        Email: "",
      });
    }
  };
  const { selectProps: selectPropsCreateUser } = useSelect({
    resource: "roles",
    optionLabel: "Name",
    optionValue: "Id",
  });

  return (
    <Form
      {...formProps}
      wrapperCol={{ span: 14 }}
      labelCol={{ span: 6 }}
      onFinish={onFinish}
      initialValues={{
        Status: true,
      }}
      onValuesChange={handleFieldsChange}
    >
      <Row gutter={20}>
        <Col span={12}>
          {isEdit && (
            <Form.Item label="ID" name="Id" hidden>
              <Input />
            </Form.Item>
          )}

          <Form.Item
            label={Renderlabel(
              isEdit,
              "UserName",
              changedFields?.includes("UserName")
            )}
            name="UserName"
            rules={[{ required: true, message: "Vui lòng nhập UserName!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          {/* <Space.Compact style={{ width: "100%" }}>
            <Button onClick={handleGetUserLdap} type="primary">
              Tìm
            </Button>
          </Space.Compact> */}
          <Form.Item
            label={Renderlabel(
              isEdit,
              "Role",
              changedFields?.includes("RoleId")
            )}
            name="RoleId"
            rules={[{ required: true, message: "Vui lòng nhập Role!" }]}
          >
            <Select
              {...selectPropsCreateUser}
              style={{ width: "100%" }}
              defaultValue={{
                label: selectPropsCreateUser?.options?.find(
                  (item) =>
                    item.value === formProps.form?.getFieldValue("RoleId")
                )?.label,
                value: selectPropsCreateUser?.options?.find(
                  (item) =>
                    item.value === formProps.form?.getFieldValue("RoleId")
                )?.value,
              }}
            />
          </Form.Item>
          <Form.Item
            label={Renderlabel(
              isEdit,
              "FirstName",
              changedFields?.includes("FirstName")
            )}
            name="FirstName"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập FirstName!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={Renderlabel(
              isEdit,
              "LastName",
              changedFields?.includes("LastName")
            )}
            name="LastName"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập LastName!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={Renderlabel(
              isEdit,
              "Email",
              changedFields?.includes("Email")
            )}
            name="Email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Vui lòng nhập E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={Renderlabel(
              isEdit,
              "Mã đơn vị",
              changedFields?.includes("MaDonVi")
            )}
            name="MaDonVi"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã đơn vị",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={Renderlabel(
              isEdit,
              "Tên đơn vị",
              changedFields?.includes("TenDonVi")
            )}
            name="TenDonVi"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã đơn vị",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={Renderlabel(
              isEdit,
              "Trạng thái",
              changedFields?.includes("EmailConfirmed")
            )}
            name="EmailConfirmed"
          >
            <Switch defaultChecked onChange={onChange} />
          </Form.Item>
          {/* <Form.Item>
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 200, xxl: 200 }}
              src={`/avatar/${urlAvatarCreateUser}.jpg?${dayjs().valueOf()}`}
            />
          </Form.Item> */}
        </Col>
      </Row>
    </Form>
  );
};
