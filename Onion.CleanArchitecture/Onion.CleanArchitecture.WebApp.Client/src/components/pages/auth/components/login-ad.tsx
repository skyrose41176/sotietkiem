import { authProvider } from "@providers/auth-provider";
import { ThemedTitleV2 } from "@refinedev/antd";
import {
  LoginPageProps,
  useLink,
  useRouterContext,
  useRouterType,
  useTranslate,
} from "@refinedev/core";
import {
  Button,
  Card,
  CardProps,
  Col,
  Divider,
  Form,
  FormProps,
  Input,
  Layout,
  LayoutProps,
  Row,
  theme,
  Typography,
} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { containerStyles, layoutStyles, titleStyles } from "./styles";

export interface LoginAdFormTypes {
  user?: string; // or any field you like
  userAd?: string; // or any field you like
  password?: string;
  remember?: boolean;
  providerName?: string;
  redirectPath?: string;
}

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
export const LoginAdPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
}) => {
  const { token } = theme.useToken();
  const [formLoginAdPage] = Form.useForm<LoginAdFormTypes>();
  const translateLoginAdPage = useTranslate();
  const routerTypeLoginAdPage = useRouterType();
  const LinkLoginAdPage = useLink();
  const { Link: LegacyLinkLoginAdPage } = useRouterContext();
  const navigateLoginAdPage = useNavigate();
  const ActiveLinkLoginAdPage =
    routerTypeLoginAdPage === "legacy"
      ? LegacyLinkLoginAdPage
      : LinkLoginAdPage;

  const handleLoginAd = async (userAd: string) => {
    const resultLoginAdPage = await authProvider.loginAd({ userAd });

    if (resultLoginAdPage.success) {
      navigateLoginAdPage("/dashboard");
    } else {
      navigateLoginAdPage("/login");
    }
  };
  const PageTitleLoginAdPage =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "20px",
        }}
      >
        {title ?? <ThemedTitleV2 collapsed={false} />}
      </div>
    );

  const CardTitleLoginAdPage = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      Đăng nhập bằng tài khoản máy tính
    </Typography.Title>
  );

  const renderProviderLoginAds = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <Button
                key={provider.name}
                type="default"
                block
                icon={provider.icon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "8px",
                }}
              >
                {provider.label}
              </Button>
            );
          })}
          {!hideForm && (
            <Divider>
              <Typography.Text
                style={{
                  color: token.colorTextLabel,
                }}
              >
                {translateLoginAdPage("pages.login.divider", "or")}
              </Typography.Text>
            </Divider>
          )}
        </>
      );
    }
    return null;
  };

  const CardContentLoginAdPage = (
    <Card
      title={CardTitleLoginAdPage}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
      {...(contentProps ?? {})}
    >
      {renderProviderLoginAds()}
      {!hideForm && (
        <Form<LoginAdFormTypes>
          layout="vertical"
          form={formLoginAdPage}
          onFinish={(values) => {
            handleLoginAd(values?.userAd ?? "");
          }}
          requiredMark={false}
          initialValues={{
            remember: false,
          }}
          {...formProps}
        >
          <Form.Item
            name="userAd"
            label="Tên đăng nhập"
            rules={[
              {
                required: true,
                message: "Tên đăng nhập bắt buộc nhập",
              },
            ]}
          >
            <Input size="large" placeholder="UserAd" />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          ></div>
          {!hideForm && (
            <Form.Item>
              <Button type="primary" size="large" htmlType="submit" block>
                Đăng nhập
              </Button>
            </Form.Item>
          )}
        </Form>
      )}

      {registerLink ?? (
        <div
          style={{
            marginTop: hideForm ? 16 : 8,
          }}
        >
          <Typography.Text style={{ fontSize: 12 }}>
            {translateLoginAdPage(
              "pages.login.buttons.noAccount",
              "Don’t have an account?"
            )}{" "}
            <ActiveLinkLoginAdPage
              to="/register"
              style={{
                fontWeight: "bold",
                color: token.colorPrimaryTextHover,
              }}
            >
              {translateLoginAdPage("pages.login.signup", "Sign up")}
            </ActiveLinkLoginAdPage>
          </Typography.Text>
        </div>
      )}
    </Card>
  );

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align={hideForm ? "top" : "middle"}
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
          paddingTop: hideForm ? "15dvh" : "16px",
        }}
      >
        <Col xs={22}>
          {renderContent ? (
            renderContent(CardContentLoginAdPage, <></>)
          ) : (
            <>
              {PageTitleLoginAdPage}
              {CardContentLoginAdPage}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};
