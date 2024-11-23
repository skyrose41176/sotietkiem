import { renderFilterDropdownInput } from "@components/filter-dropdown/filter-dropdown-input";
import { PaginationTotal } from "@components/pagination-total";
import {
  CloneButton,
  DateField,
  DeleteButton,
  EditButton,
  ExportButton,
  FilterDropdown,
  getDefaultSortOrder,
  List,
  ShowButton,
  useSelect,
  useTable,
} from "@refinedev/antd";
import {
  CanAccess,
  getDefaultFilter,
  useDeleteMany,
  useExport,
  useMany,
  useNavigation,
} from "@refinedev/core";
import { IUser } from "@routes/identity/users";
import { Button, DatePicker, Select, Space, Table } from "antd";
import React from "react";
import { IProduct } from "./types";
import { CustomFilterDropdown } from "@components/filter-dropdown/custom-filter-dropdown";
import { RenderNumberField } from "@components/render-number-field";
import { RenderEmptyText } from "@components/render-empty-text";
export const ListProduct = () => {
  const { mutate: deleteMutate } = useDeleteMany();
  const { tableProps, sorters, filters } = useTable<IProduct>({
    resource: "products",
    pagination: { current: 1, pageSize: 10 },
    sorters: { initial: [{ field: "Id", order: "desc" }] },
  });
  const { data: usersCreateBy, isLoading: isLoadingCreateBy } = useMany<IUser>({
    resource: "users",
    ids: [...new Set(tableProps?.dataSource?.map((user) => user.CreatedBy))],
  });

  // const { data: usersModifiedBy, isLoading: isLoadingModifiedBy } =
  //   useMany<IUser>({
  //     resource: "users",
  //     ids: [
  //       ...new Set(tableProps?.dataSource?.map((user) => user.LastModifiedBy)),
  //     ],
  //   });

  const { triggerExport, isLoading: exportLoading } = useExport<IProduct>({
    filters,
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
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const { create, push } = useNavigation();

  const handleDelete = () => {
    const ids = selectedRowKeys.map((key) => key.toString());
    deleteMutate({ resource: "products", ids });
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <List
      headerButtons={
        <>
          <CanAccess resource="products" action="create">
            <Button onClick={() => create("products")}>Create</Button>
          </CanAccess>
          <CanAccess resource="products" action="create-range">
            <Button onClick={() => push("/products/create-range")}>
              Create range
            </Button>
          </CanAccess>

          <CanAccess resource="products" action="delete-range">
            <Button
              disabled={selectedRowKeys.length === 0}
              onClick={() => handleDelete()}
            >
              Delete range {selectedRowKeys.length}
            </Button>
          </CanAccess>

          <CanAccess resource="products" action="export">
            <ExportButton onClick={triggerExport} loading={exportLoading} />
          </CanAccess>
        </>
      }
    >
      <Table
        {...tableProps}
        rowKey="Id"
        locale={RenderEmptyText}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="products" />
          ),
        }}
        rowSelection={rowSelection}
      >
        <Table.Column
          dataIndex="Id"
          title="ID"
          sorter
          showSorterTooltip={false}
          defaultSortOrder={getDefaultSortOrder("Id", sorters)}
        />
        <Table.Column
          dataIndex="Name"
          title="Name"
          sorter
          showSorterTooltip={false}
          defaultSortOrder={getDefaultSortOrder("Name", sorters)}
          defaultFilteredValue={getDefaultFilter("Name", filters)}
          filterDropdown={renderFilterDropdownInput}
        />

        <Table.Column
          dataIndex="Barcode"
          title="Barcode"
          sorter
          showSorterTooltip={false}
          defaultSortOrder={getDefaultSortOrder("Barcode", sorters)}
          defaultFilteredValue={getDefaultFilter("Barcode", filters)}
          filterDropdown={renderFilterDropdownInput}
        />
        <Table.Column
          dataIndex="Rate"
          title="Rate"
          sorter
          showSorterTooltip={false}
          defaultSortOrder={getDefaultSortOrder("Rate", sorters)}
          defaultFilteredValue={getDefaultFilter("Rate", filters)}
          filterDropdown={renderFilterDropdownInput}
        />
        <Table.Column
          dataIndex="Price"
          title="Price"
          sorter
          showSorterTooltip={false}
          defaultSortOrder={getDefaultSortOrder("Price", sorters)}
          defaultFilteredValue={getDefaultFilter("Price", filters)}
          filterDropdown={renderFilterDropdownInput}
          render={RenderNumberField}
        />
        <Table.Column
          dataIndex="CreatedBy"
          title="Created By"
          render={(value) => {
            if (isLoadingCreateBy) {
              return "Loading...";
            }
            return (
              usersCreateBy?.data?.find((role) => role.Id == value)?.UserName ??
              "Not Found"
            );
          }}
          filterDropdown={renderFilterDropdownSelectNguoiDung}
        />
        {/* <Table.Column
          dataIndex="LastModifiedBy"
          title="Last Modified By"
          render={(value) => {
            if (isLoadingModifiedBy) {
              return "Loading...";
            }
            return (
              usersModifiedBy?.data?.find((role) => role.Id == value)
                ?.UserName ?? "-"
            );
          }}
        />
        <Table.Column
          dataIndex="LastModified"
          title="Last Modified"
          render={(value) => {
            if (!value) return "-";
            return <DateField format="LLL" value={value} />;
          }}
          defaultFilteredValue={getDefaultFilter(
            "LastModified",
            filters,
            "between"
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <DatePicker.RangePicker />
            </FilterDropdown>
          )}
          sorter
          defaultSortOrder={getDefaultSortOrder("LastModified", sorters)}
        /> */}
        <Table.Column
          dataIndex="Created"
          title="Created At"
          render={(value) => <DateField format="LLL" value={value} />}
          defaultFilteredValue={getDefaultFilter("Created", filters, "between")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <DatePicker.RangePicker />
            </FilterDropdown>
          )}
          sorter
          defaultSortOrder={getDefaultSortOrder("Created", sorters)}
        />
        <Table.Column
          title="Actions"
          render={(_, record: IProduct) => (
            <Space>
              {/* We'll use the `EditButton` and `ShowButton` to manage navigation easily */}
              <ShowButton hideText size="small" recordItemId={record.Id} />
              <EditButton hideText size="small" recordItemId={record.Id} />
              <DeleteButton hideText size="small" recordItemId={record.Id} />
              <CanAccess resource="products" action="clone">
                <CloneButton hideText size="small" recordItemId={record.Id} />
              </CanAccess>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
