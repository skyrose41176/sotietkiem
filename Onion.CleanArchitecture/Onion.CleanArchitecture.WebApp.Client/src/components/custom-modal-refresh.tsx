import { Alert, Button, Modal } from 'antd';
import React, { useState } from 'react'

export const CustomModalRefresh: React.FC<{ open: boolean, moreHandleRefresh: () => void }> = ({ open, moreHandleRefresh }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleRefresh = () => {
    setIsConfirmed(true);
  };

  return (
    <Modal
      title="Thông báo"
      open={open}
      closable={isConfirmed}
      footer={<Button type="primary" size="small" onClick={() => {
        handleRefresh(),
          moreHandleRefresh()
      }}>
        Cập nhật
      </Button>}
    >
      <Alert
        showIcon
        message="Vui lòng nhấn nút cập nhật để xem sự thay đổi !"
        type="warning"
        style={{ marginBottom: 20 }}
      />
    </Modal>
  );
}
