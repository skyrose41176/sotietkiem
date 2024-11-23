import { FilterDropdownProps } from "@refinedev/antd";
import { Button, Space } from "antd";
import dayjs from "dayjs";
import React from "react";

export const CustomFilterDropdown: React.FC<FilterDropdownProps> = (props) => {
  const {
    setSelectedKeys,
    confirm,
    clearFilters,
    mapValue = (value: any) => value,
    selectedKeys,
    children,
  } = props;
  const onFilter = () => {
    let keys;

    if (typeof selectedKeys === "number") {
      keys = `${selectedKeys}`;
    } else if (dayjs.isDayjs(selectedKeys)) {
      keys = [selectedKeys.toISOString()];
    } else {
      keys = selectedKeys;
    }

    setSelectedKeys(keys);
    confirm();
  };

  const onChange = (e: any) => {
    if (typeof e === "object") {
      if (Array.isArray(e)) {
        const mappedValue = mapValue(e, "onChange");
        return setSelectedKeys(mappedValue);
      }
      const isTargetUndefined = !e?.target;

      const isDayjsInstance = dayjs.isDayjs(e);

      const changeEvent =
        isTargetUndefined && isDayjsInstance ? { target: { value: e } } : e;

      if (isTargetUndefined) {
        const mappedValue = mapValue(e, "onChange");
        return setSelectedKeys(mappedValue);
      }
      const { target }: React.ChangeEvent<HTMLInputElement> = changeEvent;
      const mappedValue = mapValue(target.value as any, "onChange");
      return setSelectedKeys(mappedValue);
    }

    const mappedValue = mapValue(e, "onChange");
    setSelectedKeys(mappedValue);
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement, {
        onChange,
        value: mapValue(selectedKeys, "value"),
      });
    }
    return child;
  });
  return (
    <div
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <div style={{ marginBottom: 15 }}>{childrenWithProps}</div>
      <Space>
        <Button
          type="primary"
          onClick={() => onFilter()}
          size="small"
          style={{ width: 90 }}
        >
          Lọc
        </Button>
        <Button
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Xóa
        </Button>
      </Space>
    </div>
  );
};
