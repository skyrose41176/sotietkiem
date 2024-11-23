import {
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { CardComponent } from "@components/card-component";
import {
  CreateButton,
  EditButton,
  ImportButton,
  List,
  useImport,
  useTable,
} from "@refinedev/antd";
import {
  CanAccess,
  useCustomMutation,
  useUpdate,
} from "@refinedev/core";
import { handleExport } from "@utilities/index";
import { Button, Flex, Form, Input, Modal, Space, Table, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CsvReader = () => {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: "policy",
    pagination: { current: 1, pageSize: 10 },
  });

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const columns = [
    {
      title: "#",
      key: "rowNumber",
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: "Role",
      dataIndex: "Role",
      key: "Role",
    },
    {
      title: "Resource",
      dataIndex: "PolicyName",
      key: "PolicyName",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
    },
    {
      title: "Actions",
      key: "action",
      render: (text: any, record: any) => (
        <Space>
          <EditButton hideText onClick={() => onEdit(record)} size="small" />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const onEdit = (record: any) => {
    setIsEditMode(true);
    setCurrentRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    navigate("/policy/create");
  };

  const handleOk = () => {
    try {
      const values = form.validateFields() as any;
      const newRecord = {
        Permission: "p",
        Role: values?.Role,
        PolicyName: values?.PolicyName,
        Action: values?.Action,
      };

      if (isEditMode) {
        const payload = {
          old: currentRecord,
          new: newRecord,
        };
        UpdateStateGiaoDich({
          resource: "policy",
          values: payload,
          id: "update",
        });
      } else {
        UpdateStateGiaoDich({
          resource: "policy",
          values: newRecord,
          id: "create",
        });
      }

      setIsModalVisible(false);
      tableQueryResult.refetch();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  const { mutate: UpdateStateGiaoDich } = useUpdate();

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (record: any) => {
    const payload = {
      permission: record.Permission,
      role: record.Role,
      policyName: record.PolicyName,
      action: record.Action,
    };
    UpdateStateGiaoDich({
      resource: "policy",
      values: payload,
      id: "delete",
    });
    tableQueryResult.refetch();
  };

  const token = localStorage.getItem("access_token") ?? "";
  const { mutate, isLoading: isLoadingMutate } = useCustomMutation<any>();
  const [importProgress, setImportProgress] = useState({
    processed: 0,
    total: 0,
  });
  const importProps = useImport<any>({
    resource: "policy",
    onFinish: (result) => {
      const { succeeded, errored } = result;

      if (succeeded.length > 0) {
        setLoading(false);
      }

      if (errored.length > 0) {
        setLoading(false);
      }
    },
    onProgress: (progress) => {
      setImportProgress({
        processed: progress.processedAmount,
        total: progress.totalAmount,
      });
    },
    paparseOptions: {
      header: false,
      skipEmptyLines: true,
      complete: (results: any) => {
        const formattedData = results.data.map((row: any) => ({
          permission: row[0],
          role: row[1],
          policyName: row[2],
          action: row[3],
        }));

        setLoading(true);
        fetch("/api/policy/range", {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        })
          .then((response) => response.json())
          .then(() => {
            setLoading(false);
            tableQueryResult.refetch();
          })
          .catch(() => {
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
      },
    },
  });

  return (
    <List title='Trình đọc tệp CSV'
      headerButtons={
        <CanAccess resource="policy" action="create">
          <CreateButton onClick={handleCreate}>Tạo Policy</CreateButton>
        </CanAccess>
      }
    >
      <CardComponent className="card-custom"
        title={
          <Flex>
            <ImportButton {...importProps} accept=".csv" loading={loading}>
              <Space direction="horizontal">
                <Typography.Text>Nhập CSV</Typography.Text>
                <Typography.Text>{importProgress.processed}/{importProgress.total}</Typography.Text>
              </Space>
            </ImportButton>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExport(mutate, token, '/api/policy/export')}
              loading={isLoadingMutate}
              style={{ marginLeft: "8px" }}
            >
              Xuất CSV
            </Button>
          </Flex>
        }>
        <Table size="small" {...tableProps} columns={columns} rowKey="id" />
      </CardComponent>
      <Modal
        title={isEditMode ? "Edit Policy" : "Create Policy"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Role"
            label="Role"
            rules={[{ required: true, message: "Please input the role!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="PolicyName"
            label="Policy Name"
            rules={[
              { required: true, message: "Please input the policy name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Action"
            label="Action"
            rules={[{ required: true, message: "Please input the action!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </List>
  );
};

export default CsvReader;
