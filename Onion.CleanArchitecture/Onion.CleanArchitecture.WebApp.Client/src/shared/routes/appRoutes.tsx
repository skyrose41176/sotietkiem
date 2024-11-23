import {
  AuthPage,
  ErrorComponent,
  ImageField,
  ThemedLayoutV2,
  ThemedTitleV2,
} from "@refinedev/antd";
import { Authenticated, CanAccess } from "@refinedev/core";
import {
  CatchAllNavigate,
  NavigateToResource,
} from "@refinedev/react-router-v6";
import { Outlet, Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "./protected";
import LoginPage from "@routes/authens/login";
import { CustomTitleAvatar, Sider, Unauthorized } from "@components/index";
import { LoginAdPage } from "@components/pages/auth/components";

export const AppRoutes = () => {
  const renderTitleThemedLayoutV2 = ({ collapsed }: { collapsed: any }) => (
    <CustomTitleAvatar collapsed={collapsed} />
  );
  const renderSiderAppRoutes = () => <Sider />;
  return (
    <Routes>
      <Route
        element={
          <Authenticated
            key="authenticated-layout"
            fallback={<CatchAllNavigate to="/login-ad" />}
          >
            <ThemedLayoutV2
              // Sider={renderSiderAppRoutes}
              Title={renderTitleThemedLayoutV2}
            >
              <Outlet />
            </ThemedLayoutV2>
          </Authenticated>
        }
      >
        <Route index element={<NavigateToResource resource="dashboard" />} />
        {ProtectedRoutes.map((item, index) => (
          <Route path={item.resource} key={(item.resource ?? "") + index}>
            {item?.children?.map((child, key) => (
              <Route
                index={!!child?.index}
                path={child.path ?? undefined}
                key={(child.path ?? "") + key}
                element={
                  <CanAccess
                    resource={item?.resource}
                    action={child?.action}
                    fallback={item?.fallback || <Unauthorized />}
                  >
                    {child?.element}
                  </CanAccess>
                }
              />
            ))}
          </Route>
        ))}
      </Route>
      <Route
        element={
          <Authenticated key="auth-pages" fallback={<Outlet />}>
            <NavigateToResource />
          </Authenticated>
        }
      >
        <Route path="/authen" element={<LoginPage />} />
        <Route
          path="/login"
          element={
            <AuthPage
              type="login"
              title={
                <ThemedTitleV2
                  icon={
                    <ImageField
                      value="https://static.f555.com.vn/web/f555-logo.png"
                      title="f555 Logo"
                      style={{ width: 30, height: 30 }}
                    />
                  }
                  text="f555 Admin"
                  collapsed={false}
                />
              }
              forgotPasswordLink={false}
              registerLink={false}
              formProps={{
                initialValues: {
                  email: "",
                  password: "",
                },
              }}
            />
          }
        />
        <Route
          path="/login-ad"
          element={
            <LoginAdPage
              formProps={{
                initialValues: {
                  userAd: "",
                },
              }}
              forgotPasswordLink={false}
              registerLink={false}
              title={
                <ThemedTitleV2
                  icon={
                    <ImageField
                      value="https://static.f555.com.vn/web/f555-logo.png"
                      title="f555 Logo"
                      style={{ width: 30, height: 30 }}
                    />
                  }
                  text="f555 Admin"
                  collapsed={false}
                />
              }
            />
          }
        />
      </Route>
      <Route
        element={
          <Authenticated key="catch-all">
            <ThemedLayoutV2>
              <Outlet />
            </ThemedLayoutV2>
          </Authenticated>
        }
      >
        <Route path="*" element={<ErrorComponent />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
