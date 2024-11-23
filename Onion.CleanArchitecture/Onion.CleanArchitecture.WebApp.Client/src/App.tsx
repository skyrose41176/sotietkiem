import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import { App as AntdApp, ConfigProvider } from "antd";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { resources, themeConfig } from "./config";
import { accessControlProvider, authProvider, dataProvider } from "./providers";
import AppRoutes from "./shared/routes/appRoutes";
import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";
import { liveProvider } from "@refinedev/ably";
import { ablyClient } from "@utilities/index";
import "@/assets/css/styles.css";

const App: React.FC = () => {
  return (
    (<DevtoolsProvider>
      <BrowserRouter>
        <ConfigProvider theme={themeConfig}>
          <AntdApp>
            <Refine
              liveProvider={liveProvider(ablyClient)}
              dataProvider={dataProvider}
              authProvider={authProvider}
              routerProvider={routerProvider}
              accessControlProvider={accessControlProvider}
              notificationProvider={useNotificationProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "FwXeSV-wYmBgt-iFYDxf"
              }}
              resources={resources}
            >
              <AppRoutes />
            </Refine>
            <DevtoolsPanel />
          </AntdApp>
        </ConfigProvider>
      </BrowserRouter>
    </DevtoolsProvider>)
  );
};

export default App;
