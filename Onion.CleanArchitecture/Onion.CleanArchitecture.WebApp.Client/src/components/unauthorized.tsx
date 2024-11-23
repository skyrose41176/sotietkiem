import React from "react";
import { useGo } from "@refinedev/core";
import { Button, Result } from "antd";

export const Unauthorized: React.FC = () => {
  const go = useGo();
  const handleBackHome = () => {
    go({
      to: {
        resource: "dashboard",
        action: "list",
      },
    });
  };
  return (
    <Result
      status="403"
      title="403"
      subTitle="Bạn không có quyên truy cập trang này"
      extra={
        <Button onClick={handleBackHome} type="primary">
          Quay lại
        </Button>
      }
    />
  );
};
