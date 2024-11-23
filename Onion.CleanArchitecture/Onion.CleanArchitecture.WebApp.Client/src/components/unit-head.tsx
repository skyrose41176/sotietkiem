
import React from "react";
import { useOne } from "@refinedev/core";
import { IUser } from "@routes/identity/users";
import { Empty, List, Typography } from 'antd';
import { CardComponent, UserInfo } from "@components/index";
export const UnitHead: React.FC<{
  info: any,
  title: string,
  role: number
}> = ({ info, title, role }) => {
  let unitHead: any
  if (role) {
    unitHead = info?.find((user: any) => user.VaiTro === role);
  }
  const { data: user } = useOne<IUser>({
    resource: "users",
    id: unitHead?.UserId
  })
  const originUser = user?.data ?? null;
  return (
    <CardComponent
      extra=''
      title={
        <Typography style={{ color: "#1677FF" }}>
          {title}
        </Typography>
      }
      className="card-custom"
      style={{ marginBottom: 8 }}
    >
      <List>
        {originUser ? (
          <List.Item style={{ padding: "0px 12px" }}>
            <UserInfo
              info={originUser}
            />
          </List.Item>
        ) :
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </List>
    </CardComponent>
  );
};


