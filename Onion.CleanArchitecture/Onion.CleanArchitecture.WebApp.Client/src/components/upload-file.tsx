import { InboxOutlined } from "@ant-design/icons";
import { getBase64 } from "@utilities/getBase64";
import { removeAccent } from "@utilities/remove-accent";
import type { GetProp, UploadProps } from "antd";
import {
  Card,
  Form,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import React, { useState } from "react";
import { ModalPreviewPdf } from "./modal-preview-pdf";

const { Dragger } = Upload;

const urlUpload = `${window.location.origin}${"/api/file/multiple?folder=onion"}`;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

type ImageUploadProps = {
  setFieldsValue: ((values: any) => void) | undefined;
  fieldName: string;
  rule?: boolean;
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];


const UploadFile: React.FC<ImageUploadProps> = ({
  setFieldsValue,
  fieldName,
  rule,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [isImage, setIsImage] = useState<boolean>(false);

  const beforeUpload = (file: FileType) => {
    const checkName = removeAccent(file.name);
    const isPdfOrExcelOrJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "application/pdf" ||
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isPdfOrExcelOrJpgOrPng) {
      message.error("You can only upload JPG/PNG/PDF/Excel files!");
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error("File must be smaller than 20MB!");
    }
    if (!checkName) {
      message.error("File name contains invalid characters!");
    }
    return isLt20M && isPdfOrExcelOrJpgOrPng && checkName;
  };

  const handlePreview = async (file: any) => {
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );

    if (file.type === "application/pdf") {
      setPreviewImage(file.url || file.preview);
      setIsImage(false);
    } else if (file.type.startsWith("image/")) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setIsImage(true);
    } else {
      setIsImage(false);
      if (file.url) {
        window.location.href = file.url;
      } else {
        message.info("This file cannot be previewed, please download to view.");
      }
    }
    setPreviewVisible(true);
  };
  const handleDown = async (file: any) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      const responseFile = info.file.response?.files?.[0];
      if (responseFile) {
        const { Url, Name } = responseFile;
        if (setFieldsValue) {
          const fieldUpdate = { [fieldName]: Url };
          setFieldsValue(fieldUpdate);
        }
        info.file.url = Url;
        info.file.name = Name;
        message.success(`${Name} file uploaded successfully`);
      }
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleRemove: UploadProps["onRemove"] = async (file) => {
    const fileDelete = file.url;
    if (fileDelete) {
      const nameFile = file.name;
      try {
        await fetch(`${urlUpload}/${encodeURIComponent(nameFile)}`, {
          method: "DELETE",
        });
        message.success(`${nameFile} file removed successfully`);
        if (setFieldsValue) {
          const fieldUpdate = { [fieldName]: "" };
          setFieldsValue(fieldUpdate);
        }
      } catch {
        message.error(`${nameFile} file removal failed.`);
      }
    }
  };

  const handleClose = () => {
    setPreviewVisible(false);
  };
  return (
    <Card
      className="card-custom"
      style={{ background: "white" }}
      title={
        <Space direction="horizontal">
          <Typography style={{ color: "#1677FF", background: "white" }}>
            Đính kèm
          </Typography>
          <Typography
            style={{
              color: "#1677FF",
              background: "white",
              fontWeight: "normal",
              fontSize: "12px",
            }}
          >
            (Tối đa 5 file - PDF hoặc Excel)
          </Typography>
        </Space>
      }
    >
      <Form.Item
        {...formItemLayout}
        name="upload"
        style={{ flex: 1, marginBottom: 0 }}
        rules={[
          { required: rule, message: "Please upload at least one file." },
        ]}
      >
        <Dragger
          name="uploadedFiles"
          action={urlUpload}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onRemove={handleRemove}
          onPreview={handlePreview}
          onDownload={handleDown}
          maxCount={5}
          multiple={true}
          accept=".pdf, .xlsx, image/png, image/jpeg"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <Typography className="ant-upload-text">
            Chọn tập tin hoặc kéo thả vào đây
          </Typography>
          <Typography.Text className="ant-upload-hint">
            Hỗ trợ tải lên một hoặc nhiều tập tin. (PDF hoặc Excel)
          </Typography.Text>
        </Dragger>
      </Form.Item>
      <ModalPreviewPdf
        visible={previewVisible}
        isImage={isImage}
        previewImage={previewImage}
        title={previewTitle}
        handleClose={handleClose}
      />
    </Card>
  );
};

export default UploadFile;
