import { Progress } from "@routes/interfaces";
import { ProgressStatusDummy } from "@utilities/dummy";
import { Tag } from "antd";
import React, { Fragment } from "react";

const ProgressStatusTag: React.FC<{ progress: boolean }> = ({ progress }) => {
  const option = ProgressStatusDummy.find(
    (option: Progress) => option.num === (progress ? 1 : 0)
  );
  return (
    <Fragment>
      {option ? (
        <Tag icon={option.icon} color={option?.color}>
          {option?.label}
        </Tag>
      ) : null}
    </Fragment>
  );
};

export default ProgressStatusTag;
