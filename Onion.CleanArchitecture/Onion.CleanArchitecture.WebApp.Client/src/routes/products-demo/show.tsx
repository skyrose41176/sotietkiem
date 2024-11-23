import { GetOneResponse, useShow } from "@refinedev/core";
import { IProduct } from "./types";
import { Show, Breadcrumb, ListButton, RefreshButton } from "@refinedev/antd";
import { Layout, Skeleton } from "antd";
import { useEffect, useState } from "react";
import ContentRecordDetail from "@components/pages/product/record-detail/content-record-detail";

export const ShowProduct = () => {
  const {
    queryResult: { isLoading, data },
  } = useShow<IProduct>();
  const [originalData, setOriginalData] = useState<GetOneResponse<IProduct>>();
  useEffect(() => {
    if (data) {
      setOriginalData(data);
    }
  }, [data]);
  if (!data?.data) return <Skeleton />;
  const renderHeaderShowProduct = ({
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
    <Show
      resource="products"
      isLoading={isLoading}
      title={"Chi tiết sản phẩm"}
      breadcrumb={
        <Breadcrumb
          breadcrumbProps={{
            items: [
              {
                title: "Sản phẩm",
                href: "/products",
              },
              {
                title: "Chi tiết sản phẩm",
              },
            ],
          }}
        />
      }
      canDelete={false}
      canEdit={false}
      headerButtons={renderHeaderShowProduct}
    >
      <Layout style={{ gap: 8 }}>
        <ContentRecordDetail productInfo={originalData?.data} />
      </Layout>
    </Show>
  );
};
