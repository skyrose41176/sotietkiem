import { DeleteButtonCustom } from "@components/buttons";
import { CustomFilterDropdown } from "@components/filter-dropdown/custom-filter-dropdown";
import { renderFilterDropdownInput } from "@components/filter-dropdown/filter-dropdown-input";
import { PaginationTotal } from "@components/pagination-total";
import ProgressStatusTag from "@components/progress-status-tag";
import { RenderEmptyText } from "@components/render-empty-text";
import { ColumnSTT } from "@components/table-column-stt";
import {
  CreateButton,
  DateField,
  EditButton,
  getDefaultSortOrder,
  List,
  useSelect,
  useTable,
} from "@refinedev/antd";
import {
  CanAccess,
  getDefaultFilter,
  useMany,
  useNavigation,
} from "@refinedev/core";
import { IUser } from "@routes/identity/users";
import { Select, Space, Table } from "antd";
import { IProduct } from "./types";
export const ListProduct = () => {
  const { tableProps, sorters, filters } = useTable<IProduct>({
    resource: "products",
    pagination: { current: 1, pageSize: 10 },
  });
  const { data: usersCreateBy, isLoading: isLoadingCreateBy } = useMany<IUser>({
    resource: "users",
    ids: [...new Set(tableProps?.dataSource?.map((user) => user.CreatedBy))],
  });
  const { selectProps } = useSelect({
    resource: "users",
    optionLabel: "UserName",
    optionValue: "Id",
    defaultValue: getDefaultFilter("CreatedBy", filters, "eq"),
  });
  const renderFilterDropdownSelectNguoiDung = (props: any) => {
    return (
      <CustomFilterDropdown {...props}>
        <Select
          notFoundContent={"Không có dữ liệu"}
          style={{ minWidth: 200 }}
          {...selectProps}
          mode="multiple"
        />
      </CustomFilterDropdown>
    );
  };
  const { create: createProduct } = useNavigation();
  return (
    <List
      title="Danh sách "
      headerButtons={
        <CanAccess resource="products" action="create">
          <CreateButton onClick={() => createProduct("products")}>
            Tạo mới
          </CreateButton>
        </CanAccess>
      }
    >
      <Table
        {...tableProps}
        rowKey="Id"
        size="small"
        locale={RenderEmptyText}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => <PaginationTotal total={total} entityName="" />,
        }}
      >
        {ColumnSTT()}
        <Table.Column<IProduct>
          dataIndex="TenProduct"
          title="Tên"
          sorter
          showSorterTooltip={false}
          defaultSortOrder={getDefaultSortOrder("TenProduct", sorters)}
          defaultFilteredValue={getDefaultFilter("TenProduct", filters)}
          filterDropdown={renderFilterDropdownInput}
        />

        <Table.Column<IProduct>
          dataIndex="MaProduct"
          title="Mã"
          sorter
          showSorterTooltip={false}
          defaultSortOrder={getDefaultSortOrder("MaProduct", sorters)}
          defaultFilteredValue={getDefaultFilter("MaProduct", filters)}
          filterDropdown={renderFilterDropdownInput}
        />
        <Table.Column<IProduct> dataIndex="GhiChu" title="Ghi chú" />
        <Table.Column<IProduct>
          dataIndex="Status"
          title="Trạng thái"
          render={(progress) =>
            progress !== null && <ProgressStatusTag progress={progress} />
          }
        />
        <Table.Column<IProduct>
          dataIndex="CreatedBy"
          title="Người tạo"
          render={(value) => {
            if (isLoadingCreateBy) {
              return "Đang tải...";
            }
            return (
              usersCreateBy?.data?.find((role) => role.Id == value)?.Email ??
              "Không tìm thấy"
            );
          }}
          filterDropdown={renderFilterDropdownSelectNguoiDung}
        />
        <Table.Column<IProduct>
          dataIndex="Created"
          title="Thời gian tạo"
          render={(value) => (
            <DateField format="DD/MM/YYYY HH:MM:ss" value={value} />
          )}
          sorter
          defaultSortOrder={getDefaultSortOrder("Created", sorters)}
        />
        <Table.Column<IProduct>
          dataIndex="LastModified"
          title="Thời gian cập nhật"
          render={(value) =>
            value !== null ? (
              <DateField format="DD/MM/YYYY HH:MM:ss" value={value} />
            ) : (
              ""
            )
          }
          sorter
          defaultSortOrder={getDefaultSortOrder("Created", sorters)}
        />
        <Table.Column<IProduct>
          title="Thao tác"
          render={(_, record: IProduct) => (
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
