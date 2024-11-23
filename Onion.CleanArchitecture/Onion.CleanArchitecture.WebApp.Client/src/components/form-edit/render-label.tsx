import { Typography } from "antd";

export const Renderlabel = (
  isEdit: boolean,
  title: string,
  isChange: boolean
) => {
  return (
    <Typography style={{ color: isEdit && isChange ? "red" : "" }}>
      {title}
    </Typography>
  );
};
