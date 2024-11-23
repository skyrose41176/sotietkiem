import { DeleteButtonCustom } from "@components/buttons";
import { CustomFilterDropdown } from "@components/filter-dropdown/custom-filter-dropdown";
import { renderFilterDropdownInput } from "@components/filter-dropdown/filter-dropdown-input";
import {
  CreateButton,
  EditButton,
  List,
  ShowButton,
  useSelect,
  useTable,
} from "@refinedev/antd";
import {
  CanAccess,
  getDefaultFilter,
  useMany,
  useNavigation,
} from "@refinedev/core";
import { Role } from "@routes/roles/types";
import { Select, Space, Table, Tag, Typography } from "antd";
import { IUser, IUserShort } from "./types";
export const ListUser = () => {
  const { tableProps, filters } = useTable<IUserShort>({
    resource: "users",
    pagination: { current: 0, pageSize: 10 },
    sorters: { initial: [{ field: "Id", order: "asc" }] },
  });
  const { data: roles, isLoading } = useMany<Role>({
    resource: "roles",
    ids: tableProps?.dataSource?.map((user) => user.RoleId) ?? [],
  });
  const { selectProps } = useSelect({
    resource: "roles",
    optionLabel: "Name",
    optionValue: "Id",
    defaultValue: getDefaultFilter("RoleId", filters, "eq"),
  });
  const renderFilterDropdownSelectRoles = (props: any) => {
    return (
      <CustomFilterDropdown {...props}>
        <Select
          notFoundContent={"Không có dữ liệu"}
          style={{ minWidth: 200 }}
          {...selectProps}
        />
      </CustomFilterDropdown>
    );
  };
  const { create: createUser } = useNavigation();

  return (
    <List
      title="Danh sách người dùng"
      headerButtons={
        <CanAccess resource="users" action="create">
          <CreateButton onClick={() => createUser("users")}>
            Tạo mới
          </CreateButton>
        </CanAccess>
      }
    >
      <Table {...tableProps} rowKey="Id" size="small" bordered>
        <Table.Column<IUser>
          title="#"
          key="rowNumber"
          render={(_text, _record, index) => index + 1}
        />
        <Table.Column<IUser>
          dataIndex="LastName"
          title="Họ tên"
          render={(_, record: IUserShort) => (
            <Typography.Text>{`${record.FirstName} ${record.LastName}`}</Typography.Text>
          )}
          filterDropdown={renderFilterDropdownInput}
          defaultFilteredValue={getDefaultFilter("Name", filters)}
        />
        <Table.Column<IUser>
          align="center"
          dataIndex="RoleId"
          title="Quyền"
          render={(value) => {
            if (isLoading) {
              return "Loading...";
            }
            return (
              roles?.data?.find((role) => role.Id == value)?.Name ?? "Not Found"
            );
          }}
          filterDropdown={renderFilterDropdownSelectRoles}
          defaultFilteredValue={getDefaultFilter("RoleId", filters, "eq")}
        />
        <Table.Column<IUser>
          dataIndex="Email"
          title="Email"
          filterDropdown={renderFilterDropdownInput}
        />
        <Table.Column<IUser>
          dataIndex="EmailConfirmed"
          title="Tình trạng"
          render={(value) => {
            const color = value ? "green" : "red";
            const text = value ? "Đã kích hoạt" : "Chưa kích hoạt";
            return <Tag color={color}>{text}</Tag>;
          }}
        />
        <Table.Column
          title="Thao tác"
          width={150}
          render={(_, record: IUser) => (
            <Space>
              {/* <ShowButton hideText size="small" recordItemId={record.Id} /> */}
              <EditButton hideText size="small" recordItemId={record.Id} />
              <DeleteButtonCustom
                Id={record.Id}
                Name={`${record.FirstName} ${record.LastName}`}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
