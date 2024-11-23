import { InboxOutlined, PaperClipOutlined } from "@ant-design/icons";
import { ModalPreviewPdf } from "@components/modal-preview-pdf";
import { getBase64 } from "@utilities/getBase64";
import { removeAccent } from "@utilities/remove-accent";
import type { GetProp, UploadProps } from "antd";
import { Form, Typography, Upload, message } from "antd";
import React, { Fragment, useEffect, useState } from "react";

const { Dragger: DraggerAttachment } = Upload;

const urlUploadAttachment = `${
  window.location.origin
}${"/api/file/multiple?folder=onion"}`;

type ImageUploadPropsAttachmentEditor = {
  setFieldsValue: ((values: any) => void) | undefined;
  fieldName: string;
  rule?: boolean;
  discussion?: boolean;
  attached: (value: boolean) => void;
  initialValues?: any;
  initialLoading: boolean;
  sm: number;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const AttachmentEditor: React.FC<ImageUploadPropsAttachmentEditor> = ({
  setFieldsValue,
  fieldName,
  rule,
  discussion,
  attached,
  initialValues,
  initialLoading,
  sm,
}) => {
  const [previewVisibleAttachmentEditor, setPreviewVisibleAttachmentEditor] =
    useState(false);
  const [previewImageAttachmentEditor, setPreviewImageAttachmentEditor] =
    useState<string | undefined>();
  const [previewTitleAttachmentEditor, setPreviewTitleAttachmentEditor] =
    useState<string>("");
  const [isImageAttachmentEditor, setIsImageAttachmentEditor] =
    useState<boolean>(false);
  const [initialLoadAttachmentEditor, setInitialLoadAttachmentEditor] =
    useState(initialLoading);
  const formItemLayoutAttachmentEditor = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: sm },
    },
  };
  useEffect(() => {
    if (initialValues != undefined) {
      setInitialLoadAttachmentEditor(true);
    }
  }, [initialValues]);

  const beforeUploadAttachmentEditor = (file: FileType) => {
    const checkNameAttachmentEditor = removeAccent(file.name);
    const isPdfOrExcelOrJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "application/pdf" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isPdfOrExcelOrJpgOrPng) {
      message.error("You can only upload JPG/PNG/PDF/Excel files!");
    }
    const isLt20MAttachmentEditor = file.size / 1024 / 1024 < 20;
    if (!isLt20MAttachmentEditor) {
      message.error("File must be smaller than 20MB!");
    }
    if (!checkNameAttachmentEditor) {
      message.error("File name contains invalid characters!");
    }
    return (
      isLt20MAttachmentEditor &&
      isPdfOrExcelOrJpgOrPng &&
      checkNameAttachmentEditor
    );
  };

  const handlePreviewAttachmentEditor = async (file: any) => {
    setPreviewTitleAttachmentEditor(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    if (file.type === "application/pdf") {
      setPreviewImageAttachmentEditor(file.url || file.preview);
      setIsImageAttachmentEditor(false);
    } else if (file.type.startsWith("image/")) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImageAttachmentEditor(file.url || file.preview);
      setIsImageAttachmentEditor(true);
    } else {
      setIsImageAttachmentEditor(false);
      if (file.url) {
        window.location.href = file.url;
      } else {
        message.info("This file cannot be previewed, please download to view.");
      }
    }
    setPreviewVisibleAttachmentEditor(true);
  };
  const handleDownAttachmentEditor = async (file: any) => {
    const linkAttachmentEditor = document.createElement("a");
    linkAttachmentEditor.href = file.url;
    linkAttachmentEditor.download = file.name;
    document.body.appendChild(linkAttachmentEditor);
    linkAttachmentEditor.click();
    document.body.removeChild(linkAttachmentEditor);
  };

  const handleChangeAttachmentEditor: UploadProps["onChange"] = (info) => {
    attached(true);
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "removed") {
      return attached(false);
    }
    if (info.file.status === "done") {
      const newFileListAttachmentEditor = info.fileList.map((file) => {
        const responseFile = file.response?.files?.[0];
        if (responseFile) {
          file.url = responseFile.Url;
          file.name = responseFile.Name;
        }
        return file;
      });
      const fileUrls = newFileListAttachmentEditor.map((file) => file.url);
      if (setFieldsValue) {
        const fieldUpdateAttachmentEditor = { [fieldName]: fileUrls };
        setFieldsValue(fieldUpdateAttachmentEditor);
      }
      message.success(`${info.file.name} file uploaded successfully`);
      attached(false);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      attached(false);
    }
  };

  const handleRemoveAttachmentEditor: UploadProps["onRemove"] = async (
    file
  ) => {
    const fileDeleteAttachmentEditor = file.url;
    if (fileDeleteAttachmentEditor) {
      const nameFileAttachmentEditor = file.name;
      try {
        await fetch(
          `${urlUploadAttachment}/${encodeURIComponent(
            nameFileAttachmentEditor
          )}`,
          {
            method: "DELETE",
          }
        );
        message.success(
          `${nameFileAttachmentEditor} file removed successfully`
        );
        if (setFieldsValue) {
          const fieldUpdate = { [fieldName]: "" };
          setFieldsValue(fieldUpdate);
        }
      } catch {
        message.error(`${nameFileAttachmentEditor} file removal failed.`);
      }
    }
  };
  const handleCloseAttachmentEditor = () => {
    setPreviewVisibleAttachmentEditor(false);
  };
  const isItemRender = (originNode: any) => {
    return <div style={{ cursor: "pointer" }}>{originNode}</div>;
  };
  return (
    <Fragment>
      {initialLoadAttachmentEditor ? (
        <Form.Item
          {...formItemLayoutAttachmentEditor}
          name="upload"
          rules={[
            {
              required: initialValues?.length > 0 ? false : rule,
              message: "Please upload at least one file.",
            },
          ]}
        >
          <DraggerAttachment
            defaultFileList={initialValues ?? null}
            name="uploadedFiles"
            action={urlUploadAttachment}
            beforeUpload={beforeUploadAttachmentEditor}
            onChange={handleChangeAttachmentEditor}
            onRemove={handleRemoveAttachmentEditor}
            onPreview={handlePreviewAttachmentEditor}
            onDownload={handleDownAttachmentEditor}
            maxCount={5}
            multiple={true}
            accept=".pdf, .xlsx, image/png, image/jpeg"
            itemRender={isItemRender}
          >
            {!discussion ? (
              <Fragment>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <Typography className="ant-upload-text">
                  Chọn tập tin hoặc kéo thả vào đây
                </Typography>
                <Typography.Text className="ant-upload-hint">
                  Hỗ trợ tải lên một hoặc nhiều tập tin. (PDF hoặc Excel)
                </Typography.Text>
              </Fragment>
            ) : (
              <PaperClipOutlined />
            )}
          </DraggerAttachment>
        </Form.Item>
      ) : null}
      <ModalPreviewPdf
        visible={previewVisibleAttachmentEditor}
        isImage={isImageAttachmentEditor}
        previewImage={previewImageAttachmentEditor}
        title={previewTitleAttachmentEditor}
        handleClose={handleCloseAttachmentEditor}
      />
    </Fragment>
  );
};

export default AttachmentEditor;
