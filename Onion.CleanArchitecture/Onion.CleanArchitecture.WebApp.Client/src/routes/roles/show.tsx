import { useShow } from "@refinedev/core";
import { Role } from "./types";
import { Show, TextField } from "@refinedev/antd";
import { Card, Typography } from "antd";

export const ShowRole = () => {
    const {
        query: { isError, isLoading, data },
    } = useShow<Role>();
    if (isError) return <div>Error</div>;
    return (
        <Show isLoading={isLoading} title="Chi tiết vai trò">
            <Card className="card-custom">
                <Typography.Title level={5}>Name</Typography.Title>
                <TextField value={data?.data?.Name} />
            </Card>
        </Show>
    )
};