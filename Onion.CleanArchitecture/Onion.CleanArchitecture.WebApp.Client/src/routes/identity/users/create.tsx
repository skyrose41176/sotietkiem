import { UserOutlined } from "@ant-design/icons";
import { errorNotificationComponent } from "@components/notifications/errorNotification";
import { Breadcrumb, Create, useForm } from "@refinedev/antd";
import { Button } from "antd";
import { Card, Typography } from "antd/lib";
import { FormUser } from "./components/form-user";
import { ICreateUser } from "./types";

export const CreateUser = () => {
  const { formProps, saveButtonProps, onFinish } = useForm<ICreateUser>({
    redirect: "list",
    successNotification: {
      message: `Thêm mới người dùng thành công`,
      type: "success",
      description: "Thành công",
    },
    errorNotification(error) {
      return errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi");
    },
  });
  const renderFooterCreateUser = () => {
    return (
      <Button {...saveButtonProps} type="primary">
        Tạo
      </Button>
    );
  };

  const renderBreadcrumbCreateUser = (
    <Breadcrumb
      breadcrumbProps={{
        items: [
          {
            title: (
              <Typography>
                <UserOutlined style={{ paddingRight: 4 }} />
                Phân quyền
              </Typography>
            ),
            href: "/users",
          },
          {
            title: (
              <Typography>
                <UserOutlined style={{ paddingRight: 4 }} />
                Người dùng
              </Typography>
            ),
            href: "/users",
          },
          {
            title: "Tạo mới",
          },
        ],
      }}
    />
  );
  return (
    <Create
      title="Tạo người dùng"
      footerButtons={renderFooterCreateUser}
      breadcrumb={renderBreadcrumbCreateUser}
    >
      <Card className="card-custom">
        <FormUser formProps={formProps} onFinish={onFinish} />
      </Card>
    </Create>
  );
};
