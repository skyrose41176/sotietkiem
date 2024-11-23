import { SettingOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { FormValueChange } from "@components/form-edit/form-value-change";
import { MapKeyValue } from "@components/form-edit/map-key";
import { errorNotificationComponent } from "@components/notifications/errorNotification";
import {
  Breadcrumb,
  DeleteButton,
  Edit,
  ListButton,
  RefreshButton,
  useForm,
} from "@refinedev/antd";
import { BaseKey, useUpdate } from "@refinedev/core";
import { Button, Card, Typography } from "antd";
import { useEffect, useState } from "react";
import { FormProduct } from "./components/form-product";
import { IProduct } from "./types";

export const EditProduct = () => {
  const { formProps, saveButtonProps, queryResult, formLoading } =
    useForm<IProduct>({
      redirect: "edit",
      successNotification: {
        message: "Cập nhật  thành công",
        type: "success",
        description: "Thành công",
      },
      errorNotification: (error) =>
        errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi"),
    });

  const { mutate: updateEditProduct, isLoading: isLoadingEditProduct } =
    useUpdate();
  const [initialValuesEditProduct, setInitialValuesEditProduct] = useState<
    any | undefined
  >(null);
  const [isChangedEditProduct, setIsChangedEditProduct] = useState(false);
  const [changedFieldEditProducts, setChangedFieldEditProducts] = useState<
    string[]
  >([]);

  const handleFieldsChange = (changedValues: any, allValues: any) => {
    if (!initialValuesEditProduct) return;

    const { hasChanged, updatedFields } = FormValueChange(
      initialValuesEditProduct,
      changedValues,
      allValues,
      changedFieldEditProducts
    );
    setIsChangedEditProduct(hasChanged);
    setChangedFieldEditProducts(updatedFields);
  };

  const submitRequestEditProduct = () => {
    const allValues = formProps.form?.getFieldsValue() as IProduct;
    if (!allValues) return errorNotificationComponent("Không tìm thấy dữ liệu");

    const changedValues = Object.keys(allValues).reduce((acc: any, key) => {
      if (changedFieldEditProducts.includes(key)) {
        acc[key as keyof IProduct] = allValues[key as keyof IProduct];
      }
      return acc;
    }, {});

    const payloadEditProduct = {
      Id: queryResult?.data?.data?.Id,
      ...changedValues,
    };

    updateEditProduct({
      resource: "products",
      values: payloadEditProduct,
      id: queryResult?.data?.data?.Id as BaseKey,
      successNotification: () => {
        setIsChangedEditProduct(false);
        return {
          message: "Cập nhật  thành công",
          type: "success",
          description: "Thành công",
        };
      },
      errorNotification: (error) =>
        errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi"),
    });
  };

  const renderFooterEditProduct = ({
    deleteButtonProps,
  }: {
    deleteButtonProps: any;
  }) => (
    <>
      <DeleteButton
        {...deleteButtonProps}
        type="primary"
        confirmTitle="Bạn có chắc chắn muốn xóa  không?"
        confirmOkText="Xóa"
        confirmCancelText="Hủy"
      >
        Xóa
      </DeleteButton>
      <Button
        {...saveButtonProps}
        type="primary"
        disabled={!isChangedEditProduct}
      >
        Cập nhật
      </Button>
    </>
  );
  const renderHeaderEditProduct = ({
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
  const renderBreadcrumbEditProduct = (
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
            title: "Cập nhật",
          },
        ],
      }}
    />
  );
  useEffect(() => {
    if (queryResult?.data?.data) {
      MapKeyValue([formProps.form], queryResult.data.data);
      setInitialValuesEditProduct(formProps?.form?.getFieldsValue());
      setIsChangedEditProduct(false);
      setChangedFieldEditProducts([]);
    }
  }, [queryResult?.data?.data, formLoading]);

  return (
    <Edit
      isLoading={formLoading || isLoadingEditProduct}
      title="Cập nhật "
      footerButtons={renderFooterEditProduct}
      headerButtons={renderHeaderEditProduct}
      breadcrumb={renderBreadcrumbEditProduct}
    >
      <Card className="card-custom">
        <FormProduct
          formProps={formProps}
          isEdit={true}
          handleFieldsChange={handleFieldsChange}
          changedFields={changedFieldEditProducts}
          onFinish={submitRequestEditProduct}
        />
      </Card>
    </Edit>
  );
};
