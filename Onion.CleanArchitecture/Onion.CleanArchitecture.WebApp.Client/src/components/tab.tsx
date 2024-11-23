
import { Tabs } from 'antd'
import React from 'react'
enum TabKey {
  ALL = "all",
  SENT = "sent",
  INBOX = "inbox",
  TRACKING = "tracking",
}
const TabsArrayDummy = [
  { key: TabKey.ALL, label: "Tất cả" },
  { key: TabKey.SENT, label: "Hộp thư đi" },
  { key: TabKey.INBOX, label: "Hộp thư đến" },
  { key: TabKey.TRACKING, label: "Đang theo dõi" },
];
export const Tab: React.FC<{
  activeTabKey: TabKey.ALL | TabKey.INBOX | TabKey.SENT | TabKey.TRACKING,
  tabChange: (key: string) => void,
}> = ({
  activeTabKey,
  tabChange,
}) => {
    return (
      <Tabs
        defaultActiveKey={activeTabKey ?? TabKey.ALL}
        activeKey={activeTabKey}
        onChange={tabChange}
        type="card"
        size="small"
      >
        {TabsArrayDummy.map(tab => (
          <Tabs.TabPane tab={tab.label} key={tab.key} />
        ))}
      </Tabs>
    )
  }


