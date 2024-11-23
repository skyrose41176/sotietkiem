import { DeleteButtonCustom } from "@components/buttons";
import {
  EditButton,
  List,
  useTable,
} from "@refinedev/antd";
import { CanAccess, useNavigation } from "@refinedev/core";
import { Button, Space, Table } from "antd";
import { Role } from "./types";

export const ListRole = () => {
  const { tableProps } = useTable<Role>({
    resource: "roles",
    pagination: { current: 1, pageSize: 10 },
    sorters: { initial: [{ field: "Id", order: "asc" }] },
  });
  const { create: createListRole } = useNavigation();

  return (
    <List
      title="Danh sách nhóm quyền"
      headerButtons={
        <CanAccess resource="roles" action="create">
          <Button
            style={{
              backgroundColor: "#1677FF",
              color: "white",
              border: "#1677FF",
            }}
            onClick={() => createListRole("roles")}
          >
            Tạo nhóm quyền
          </Button>
        </CanAccess>
      }
    >
      <Table {...tableProps} rowKey="Id" size="small">
        <Table.Column dataIndex="Id" title="ID" />
        <Table.Column dataIndex="Name" title="Name" />
        <Table.Column dataIndex="NormalizedName" title="NormalizedName" />
        <Table.Column
          title="Actions"
          width={150}
          render={(_, record: Role) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.Id} />
              <DeleteButtonCustom Id={record.Id} Name={record.Name} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
