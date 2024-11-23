import { Badge, Tag } from 'antd';
import React from 'react';
enum StatusEnum {
  OPEN = 1,
  CLOSE = 2,
}
export const StatusTag: React.FC<{ status: number | boolean | undefined }> = ({ status }) => {
  const isOpen = status === false || status === StatusEnum.OPEN;
  const badgeColor = isOpen ? 'green' : 'red';
  const badgeText = isOpen ? 'Open' : 'Close';
  return (
    <span>
      <Tag icon={<Badge style={{ marginRight: 5 }} />} color={badgeColor}>
        {badgeText}
      </Tag>
    </span>
  );
}


