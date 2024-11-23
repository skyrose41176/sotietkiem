import { NumberField } from "@refinedev/antd";

export const RenderNumberField = (value: any) => {
  return (
    <NumberField
      value={value}
      options={{
        notation: "standard",
      }}
    />
  );
};
