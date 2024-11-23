import { Create, useForm } from "@refinedev/antd";
import { Button, Card } from "antd";
import { FormProduct } from "./components/form-product";
import { IProduct } from "./types";
export const CreateProduct = () => {
  const { formProps, saveButtonProps } = useForm<IProduct>({
    redirect: "list",
  });
  const renderFooterCreateProduct = () => {
    return (
      <Button {...saveButtonProps} type="primary">
        Tạo
      </Button>
    );
  };
  return (
    <Create footerButtons={renderFooterCreateProduct}>
      <Card className="card-custom">
        <FormProduct formProps={formProps} />
      </Card>
    </Create>
  );
};
