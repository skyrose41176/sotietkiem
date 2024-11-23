import { useShow } from "@refinedev/core";
import { RoleClaim } from "./types";
import { Show, TagField, TextField } from "@refinedev/antd";
import { Card, Typography } from "antd";
export const ShowRoleClaim = () => {
  const {
    query: { isError, isLoading, data },
  } = useShow<RoleClaim>();
  if (isError) return <div>Error</div>;
  return (
    <Show isLoading={isLoading} canDelete >
      <Card className="card-custom">
        <Typography.Title level={5}>Resource</Typography.Title>
        <TextField value={data?.data?.ClaimType} />

        <Typography.Title level={5}>Actions</Typography.Title>
        {data?.data?.ClaimValue &&
          data?.data?.ClaimValue.map((claim, index) => (
            <TagField key={index} value={claim} />
          ))}
      </Card>

    </Show>
  );
};
