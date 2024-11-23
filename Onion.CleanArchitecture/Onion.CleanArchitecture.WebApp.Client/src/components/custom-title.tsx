import { ImageField, ThemedTitleV2 } from "@refinedev/antd";
import { useGetIdentity, useOne } from "@refinedev/core";
import { IUser } from "@routes/identity/users";
import { Spin } from "antd";
import React from "react";
import { CustomAvatar } from "./custom-avatar";
import { useStyles } from "./style";
import dayjs from "dayjs";

export const CustomTitleAvatar: React.FC<{ collapsed: boolean }> = ({
  collapsed,
}) => {
  const { styles } = useStyles();
  const { data: user } = useGetIdentity<IUser>();
  const { data: UserLoginData, isLoading } = useOne({
    resource: "users",
    id: user?.Uid,
  });
  const userLogin = UserLoginData?.data ?? null;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {userLogin && userLogin?.Email != "superadmin@gmail.com" ? (
        <div
          className={styles.avatar}
          style={{
            cursor: "pointer",
            marginTop: "10px",
            width: "100%",
          }}
        >
          <CustomAvatar
            sizeAvatar={60}
            src={`/avatar/${userLogin?.Email}.jpg?${dayjs().valueOf()}`}
            name={`${userLogin?.FirstName} 
                        ${userLogin?.LastName}`}
            style={{ marginBottom: "4px" }}
          />
          {!collapsed && (
            <div className={styles.titleAvatar}>
              <div style={{ fontWeight: "500", fontSize: "12px" }}>
                {userLogin?.FirstName} {userLogin?.LastName}
              </div>
              <div style={{ fontSize: "11px" }}>{userLogin?.ChucVu}</div>
            </div>
          )}
        </div>
      ) : (
        <ThemedTitleV2
          collapsed={collapsed}
          icon={
            <ImageField
              value="https://static.f555.com.vn/web/f555-logo.png"
              title="f555 Logo"
              style={{ width: 30, height: 30 }}
            />
          }
          text="f555 Admin"
        />
      )}
    </>
  );
};
