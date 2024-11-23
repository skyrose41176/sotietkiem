import React from "react";
import { Space, Typography } from "antd";
import { CardComponent } from "@components/card-component";

const ProductInfor: React.FC<{
  productInfo: any;
}> = ({ productInfo }) => {
  console.log({productInfo})
  return (
    <CardComponent
      className="card-custom"
      title={
        <Typography style={{ color: "#1677FF", fontSize: "14px" }}>
          Thông tin sản phẩm
        </Typography>
      }
      style={{ marginBottom: 8 }}
    >
      <Space direction="vertical">
        <Space direction="horizontal">
          <Typography.Text
            style={{
              color: "#666",
              fontSize: "14px",
              width: "140px",
              fontWeight: "500",
            }}
          >
            Id:
          </Typography.Text>
          <Typography.Text>{productInfo?.Id}</Typography.Text>
        </Space>
        <Space direction="horizontal">
          <Typography.Text
            style={{
              color: "#666",
              fontSize: "14px",
              width: "140px",
              fontWeight: "500",
            }}
          >
            Tên:
          </Typography.Text>
          <Typography.Text>{productInfo?.Name}</Typography.Text>
        </Space>
        <Space direction="horizontal">
          <Typography.Text
            style={{
              color: "#666",
              fontSize: "14px",
              width: "140px",
              fontWeight: "500",
            }}
          >
            Barcode:
          </Typography.Text>
          <Typography.Text> {productInfo?.Barcode}</Typography.Text>
        </Space>
        <Space direction="horizontal">
          <Typography.Text
            style={{
              color: "#666",
              fontSize: "14px",
              width: "140px",
              fontWeight: "500",
            }}
          >
            Gía:
          </Typography.Text>
          <Typography.Text> {productInfo?.Price}</Typography.Text>
        </Space>
        <Space direction="horizontal">
          <Typography.Text
            style={{
              color: "#666",
              fontSize: "14px",
              width: "140px",
              fontWeight: "500",
            }}
          >
            Rate:
          </Typography.Text>
          <Typography.Text> {productInfo?.Rate}</Typography.Text>
        </Space>
        <Space direction="horizontal">
          <Typography.Text
            style={{
              color: "#666",
              fontSize: "14px",
              width: "140px",
              fontWeight: "500",
            }}
          >
            Mô tả:
          </Typography.Text>
          <Typography.Text> {productInfo?.Description}</Typography.Text>
        </Space>
      </Space>
    </CardComponent>
  );
};

export default ProductInfor;
