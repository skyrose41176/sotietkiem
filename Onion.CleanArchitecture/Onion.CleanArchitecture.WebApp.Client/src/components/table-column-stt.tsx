import { Table } from "antd";

export const ColumnSTT = () => {
  return (
    <Table.Column
      title="STT"
      key="rowNumber"
      render={(_text, _record, index) => index + 1}
    />
  );
};
