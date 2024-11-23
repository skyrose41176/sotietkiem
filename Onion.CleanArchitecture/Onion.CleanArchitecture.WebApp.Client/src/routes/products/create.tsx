import { SettingOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { errorNotificationComponent } from "@components/notifications/errorNotification";
import { Breadcrumb, Create, useForm } from "@refinedev/antd";
import { Button, Card, Typography } from "antd";
import { FormProduct } from "./components/form-product";
import { IProduct } from "./types";
export const CreateProduct = () => {
  const { formProps, saveButtonProps, onFinish } = useForm<IProduct>({
    redirect: "list",
    successNotification: {
      message: `Thêm mới  thành công`,
      type: "success",
      description: "Thành công",
    },
    errorNotification(error) {
      return errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi");
    },
  });
  const renderFooterCreateProduct = () => {
    return (
      <Button {...saveButtonProps} type="primary">
        Tạo
      </Button>
    );
  };
  const renderBreadcrumbCreateProduct = (
    <Breadcrumb
      breadcrumbProps={{
        items: [
          {
            title: (
              <Typography>
                <SettingOutlined style={{ paddingRight: 4 }} />
                Cấu hình
              </Typography>
            ),
            href: "/products",
          },
          {
            title: (
              <Typography>
                <UsergroupAddOutlined style={{ paddingRight: 4 }} />
              </Typography>
            ),
            href: "/products",
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
      title="Tạo mới "
      footerButtons={renderFooterCreateProduct}
      breadcrumb={renderBreadcrumbCreateProduct}
    >
      <Card className="card-custom">
        <FormProduct formProps={formProps} onFinish={onFinish} />
      </Card>
    </Create>
  );
};
