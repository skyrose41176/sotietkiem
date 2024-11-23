import { List, Typography } from "antd";
import React from "react";
import { CustomAvatar } from "./custom-avatar";
export const UserInfo: React.FC<{ info: any }> = ({ info }) => {
  const avatar = (
    <CustomAvatar
      src={`/avatar/${info?.Email}.jpg`}
      name={`${info.FirstName} ${info.LastName}`}
    />
  );
  return (
    <List.Item.Meta
      avatar={avatar}
      description={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography.Text
            style={{
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            {info?.TenNhanVien}
          </Typography.Text>
          <Typography.Text style={{ fontSize: "11px" }}>
            {info?.Email}
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            {info?.ChucVu}
          </Typography.Text>
        </div>
      }
    />
  );
};
