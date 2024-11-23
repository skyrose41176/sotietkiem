import {
  DeleteButton,
  Edit,
  ListButton,
  RefreshButton,
  useForm,
} from "@refinedev/antd";
import { Button } from "antd";
import { FormProduct } from "./components/form-product";
import { IProduct } from "./types";
export const EditProduct = () => {
  const { formProps, saveButtonProps } = useForm<IProduct>({
    redirect: "list",
  });
  const renderFooterEditProduct = ({
    deleteButtonProps,
  }: {
    deleteButtonProps: any;
  }) => (
    <>
      <DeleteButton {...deleteButtonProps} type="primary">
        Xóa
      </DeleteButton>
      <Button {...saveButtonProps} type="primary">
        Cập nhật
      </Button>
    </>
  );
  const renderHeaderCreateProduct = ({
    listButtonProps,
    refreshButtonProps,
  }: {
    listButtonProps: any;
    refreshButtonProps: any;
  }) => (
    <>
      <ListButton {...listButtonProps} type="primary">
        Danh sách
      </ListButton>
      <RefreshButton {...refreshButtonProps} type="primary">
        Làm mới
      </RefreshButton>
    </>
  );
  return (
    <Edit
      footerButtons={renderFooterEditProduct}
      headerButtons={renderHeaderCreateProduct}
    >
      <FormProduct formProps={formProps} isEdit={true} />
    </Edit>
  );
};
