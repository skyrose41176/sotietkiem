import { useForm, Create } from "@refinedev/antd";
import { IProduct } from "./types";
import { FormProduct } from "./components/form-product";
export const CloneProduct = () => {
  const { formProps, saveButtonProps } = useForm<IProduct>({
    redirect: "list",
  });
  return (
    <Create resource="products" saveButtonProps={saveButtonProps} title="Clone Product">
      <FormProduct formProps={formProps} />
    </Create>
  );
};
