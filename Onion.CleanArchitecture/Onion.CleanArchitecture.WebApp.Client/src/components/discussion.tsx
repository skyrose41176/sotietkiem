import {
  PaperClipOutlined,
  SendOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { useCreate, useGetIdentity, useInvalidate } from "@refinedev/core";
import { IUser } from "@routes/identity/users";
import { IProduct } from "@routes/products";
import { RouteEnum } from "@utilities/enum";
import { formatTimeAuditLog } from "@utilities/format-time-audit-log";
import { getBase64 } from "@utilities/getBase64";
import { shortenTitle } from "@utilities/short-file-name";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  List,
  message,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AttachmentEditor from "./attachment-editor";
import { CardComponent } from "./card-component";
import { CustomAvatar } from "./custom-avatar";
import { ModalPreviewPdf } from "./modal-preview-pdf";

const Discussion: React.FC<{
  info: IProduct | undefined;
  typeRoute: RouteEnum;
}> = ({ info, typeRoute }) => {
  const { form: formDiscussion } = useForm();
  const { mutate: CreateForm } = useCreate();
  const { data: user } = useGetIdentity<IUser>();
  const { id } = useParams();
  const [originalDataDiscussion, setOriginalDataDiscussion] =
    useState<any>(null);
  const [loadingAttachedDiscussion, setLoadingAttachedDiscussion] =
    useState<boolean>(false);
  const [previewVisibleDiscussion, setPreviewVisibleDiscussion] =
    useState(false);
  const [previewImageDiscussion, setPreviewImageDiscussion] = useState<
    string | undefined
  >();
  const [previewTitleDiscussion, setPreviewTitleDiscussion] =
    useState<string>("");
  const [isImageDiscussion, setIsImageDiscussion] = useState<boolean>(false);
  const [isExpandedDiscussion, setIsExpandedDiscussion] = useState(false);
  useEffect(() => {
    if (info) {
      setOriginalDataDiscussion(info);
    }
  }, [info]);
  const handlePreviewDiscussion = async (file: any) => {
    setPreviewTitleDiscussion(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    if (file.type === "application/pdf") {
      setPreviewImageDiscussion(file.url || file.preview);
      setIsImageDiscussion(false);
    } else if (file.type.startsWith("image/")) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImageDiscussion(file.url || file.preview);
      setIsImageDiscussion(true);
    } else {
      setIsImageDiscussion(false);
      if (file.url) {
        window.location.href = file.url;
      } else {
        message.error(
          "This file cannot be previewed, please download to view."
        );
      }
    }
    setPreviewVisibleDiscussion(true);
  };
  const invalidateDiscussion = useInvalidate();
  const handleRefreshDiscussion = () => {
    invalidateDiscussion({
      resource: "products",
      id,
      invalidates: ["detail"],
    });
  };
  const handleSubmitDiscussion = (values: any) => {
    if (originalDataDiscussion) {
      const originalNameUpload = values?.upload?.fileList?.map((item: any) => ({
        Name: item.name,
        Size: item.size,
        Type: item.type,
        Url: item.url,
      }));
      try {
        CreateForm({
          resource: `thaoluans`,
          values: {
            ProductId: originalDataDiscussion?.Id,
            Noidung: values?.discussion ?? "",
            DinhKemThaoLuans: originalNameUpload,
            Emails: [user?.Email],
          },
        });
        formDiscussion.resetFields();
        setTimeout(handleRefreshDiscussion, 1000);
      } catch (error) {
        console.error("Failed to update:", error);
      }
    }
  };
  const handleCloseDiscussion = () => {
    setPreviewVisibleDiscussion(false);
  };
  return (
    <CardComponent
      className="card-custom"
      title={
        <Typography style={{ color: "#1677FF", fontSize: "14px" }}>
          Thảo luận
        </Typography>
      }
    >
      {originalDataDiscussion ? (
        <Fragment>
          <Form
            layout="vertical"
            style={{ marginTop: 10 }}
            onFinish={handleSubmitDiscussion}
            form={formDiscussion}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item style={{ width: "100%" }} name="discussion">
                <Input placeholder="Viết thảo luận" />
              </Form.Item>
              <Form.Item>
                <Button
                  disabled={loadingAttachedDiscussion}
                  key="submit"
                  icon={<SendOutlined />}
                  htmlType="submit"
                />
              </Form.Item>
            </Space.Compact>
            <AttachmentEditor
              sm={24}
              initialLoading={true}
              attached={(value: boolean) => setLoadingAttachedDiscussion(value)}
              discussion={true}
              setFieldsValue={formDiscussion?.setFieldsValue}
              fieldName="ImageUrl"
              rule={false}
            />
          </Form>
          <Card
            style={{ marginTop: 10 }}
            className="card-custom"
            title={<UnorderedListOutlined style={{ color: "#1677FF" }} />}
          >
            {originalDataDiscussion?.ThaoLuans?.length !== 0 && (
              <List
                itemLayout="horizontal"
                dataSource={
                  isExpandedDiscussion
                    ? originalDataDiscussion?.ThaoLuans
                    : originalDataDiscussion?.ThaoLuans.slice(0, 3)
                }
                renderItem={(item: any) => {
                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <CustomAvatar
                            src={`/avatar/${item?.User?.Email}.jpg`}
                          />
                        }
                        title={
                          <Flex justify="space-between" align="center">
                            <Typography.Text
                              style={{ fontSize: "11px", fontWeight: "bold" }}
                            >
                              {item.User?.TenNhanVien}
                            </Typography.Text>
                            <Typography.Text
                              style={{
                                fontSize: "10px",
                                color: "gray",
                                fontWeight: "400",
                              }}
                            >
                              {formatTimeAuditLog(item?.Created)} - Email:{" "}
                              {item?.User?.Email}
                            </Typography.Text>
                          </Flex>
                        }
                        description={
                          <Space
                            direction="vertical"
                            style={{ width: "100%", padding: "10px 0" }}
                          >
                            <Typography.Paragraph
                              style={{
                                background: "#faf9f9",
                                borderRadius: "6px",
                                padding: "8px",
                                marginBottom: 0,
                                fontSize: "12px",
                              }}
                              ellipsis={{
                                rows: 5,
                                expandable: true,
                                symbol: "Xem thêm",
                              }}
                            >
                              {item.NoiDung}
                            </Typography.Paragraph>
                            <Flex justify="flex-start">
                              <Flex
                                flex={"flex-start"}
                                wrap
                                style={{ gap: "8px" }}
                              >
                                {item?.DinhKemThaoLuans.map((i: any) => {
                                  const tranformValues = {
                                    uid: Date.now().toString(),
                                    name: i.Name,
                                    status: "done",
                                    url: i.Url,
                                    type: i.Type,
                                  };
                                  return (
                                    <Tag
                                      icon={<PaperClipOutlined />}
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "11px",
                                        backgroundColor: "#f5f5f5",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "4px",
                                        color: "#1677FF",
                                        textDecoration: "underline",
                                        fontWeight: "normal",
                                      }}
                                      key={item?.Id}
                                      onClick={() =>
                                        handlePreviewDiscussion(tranformValues)
                                      }
                                    >
                                      {shortenTitle(i?.Name, 30)}
                                    </Tag>
                                  );
                                })}
                              </Flex>
                            </Flex>
                          </Space>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
            {originalDataDiscussion.ThaoLuans.length > 3 && (
              <Typography.Link
                onClick={() => setIsExpandedDiscussion(!isExpandedDiscussion)}
              >
                {isExpandedDiscussion ? "Thu gọn" : "Xem thêm"}
              </Typography.Link>
            )}
          </Card>
          <ModalPreviewPdf
            visible={previewVisibleDiscussion}
            isImage={isImageDiscussion}
            previewImage={previewImageDiscussion}
            title={previewTitleDiscussion}
            handleClose={handleCloseDiscussion}
          />
        </Fragment>
      ) : (
        <Skeleton />
      )}
    </CardComponent>
  );
};

export default Discussion;
