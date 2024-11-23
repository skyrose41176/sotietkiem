import { Input } from "antd";
import { CustomFilterDropdown } from "./custom-filter-dropdown";

export const renderFilterDropdownInput = (props: any) => (
  <CustomFilterDropdown {...props}>
    <Input placeholder="Tìm kiếm" />
  </CustomFilterDropdown>
);
