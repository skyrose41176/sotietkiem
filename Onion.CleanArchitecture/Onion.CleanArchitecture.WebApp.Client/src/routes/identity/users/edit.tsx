import { UserOutlined } from "@ant-design/icons";
import { FormValueChange } from "@components/form-edit/form-value-change";
import { MapKeyValue } from "@components/form-edit/map-key";
import { errorNotificationComponent } from "@components/notifications/errorNotification";
import {
  Breadcrumb,
  DeleteButton,
  Edit,
  ListButton,
  RefreshButton,
  useForm,
} from "@refinedev/antd";
import { BaseKey, useUpdate } from "@refinedev/core";
import { Button, Card, Typography } from "antd/lib";
import { useEffect, useState } from "react";
import { FormUser } from "./components/form-user";
import { IUser, IUserAvatar } from "./types";
export const EditUser = () => {
  const [urlAvatarEditUser, setUrlAvatarEditUser] = useState<any>();
  const { formProps, saveButtonProps, query, formLoading } = useForm<IUser>({
    redirect: "list",
    successNotification: {
      message: `Cập nhật người dùng thành công`,
      type: "success",
      description: "Thành công",
    },
    errorNotification(error) {
      return errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi");
    },
  });

  const { mutate: updateEditUser, isLoading: isLoadingEditUser } = useUpdate();
  const [initialValuesEditUser, setInitialValuesEditUser] = useState<
    any | undefined
  >(null);
  const [isChangedEditUser, setIsChangedEditUser] = useState(false);
  const [changedFieldEditUsers, setChangedFieldEditUsers] = useState<string[]>(
    []
  );
  useEffect(() => {
    const avatarUrlEditUser = formProps.form?.getFieldValue(
      "Avatar"
    ) as IUserAvatar;
    setUrlAvatarEditUser({
      PublicId: avatarUrlEditUser?.AvatarUid,
      Url: avatarUrlEditUser?.AvatarUrl,
    });
    if (urlAvatarEditUser?.PublicId && urlAvatarEditUser?.Url) {
      formProps.form?.setFieldValue("Avatar", [
        {
          AvatarUid: urlAvatarEditUser?.PublicId,
          AvatarUrl: urlAvatarEditUser.Url,
        },
      ]);
    }
  }, [formProps.form, urlAvatarEditUser]);

  const renderFooterEditUser = ({
    deleteButtonProps,
  }: {
    deleteButtonProps: any;
  }) => (
    <>
      <DeleteButton
        {...deleteButtonProps}
        type="primary"
        confirmTitle="Bạn có chắc chắn muốn xóa người dùng không?"
        confirmOkText="Xóa"
        confirmCancelText="Hủy"
      >
        Xóa
      </DeleteButton>
      <Button {...saveButtonProps} type="primary" disabled={!isChangedEditUser}>
        Cập nhật
      </Button>
    </>
  );
  const renderHeaderEditUser = ({
    listButtonProps,
    refreshButtonProps,
  }: {
    listButtonProps: any;
    refreshButtonProps: any;
  }) => (
    <>
      <ListButton {...listButtonProps} type="primary">
        Danh sách
      </ListButton>
      <RefreshButton {...refreshButtonProps} type="primary">
        Làm mới
      </RefreshButton>
    </>
  );
  const submitRequestEditUser = () => {
    const allValues = formProps.form?.getFieldsValue() as IUser;
    if (!allValues) return errorNotificationComponent("Không tìm thấy dữ liệu");

    const changedValues = Object.keys(allValues).reduce((acc: any, key) => {
      if (changedFieldEditUsers.includes(key)) {
        acc[key as keyof IUser] = allValues[key as keyof IUser];
      }
      return acc;
    }, {});

    const payloadEditUser = {
      Id: query?.data?.data?.Id,
      ...changedValues,
    };

    updateEditUser({
      resource: "users",
      values: payloadEditUser,
      id: query?.data?.data?.Id as BaseKey,
      successNotification: () => {
        setIsChangedEditUser(false);
        return {
          message: "Cập nhật người dùng thành công",
          type: "success",
          description: "Thành công",
        };
      },
      errorNotification: (error) =>
        errorNotificationComponent(error?.message ?? "Đã xảy ra lỗi"),
    });
  };
  const handleFieldsChange = (changedValues: any, allValues: any) => {
    if (!initialValuesEditUser) return;

    const { hasChanged, updatedFields } = FormValueChange(
      initialValuesEditUser,
      changedValues,
      allValues,
      changedFieldEditUsers
    );
    setIsChangedEditUser(hasChanged);
    setChangedFieldEditUsers(updatedFields);
  };
  useEffect(() => {
    if (query?.data?.data) {
      MapKeyValue([formProps.form], query.data.data);
      setInitialValuesEditUser(formProps?.form?.getFieldsValue());
      setIsChangedEditUser(false);
      setChangedFieldEditUsers([]);
    }
  }, [query?.data?.data, formLoading]);
  const renderBreadcrumbEditUser = (
    <Breadcrumb
      breadcrumbProps={{
        items: [
          {
            title: (
              <Typography>
                <UserOutlined style={{ paddingRight: 4 }} />
                Phân quyền
              </Typography>
            ),
            href: "/users",
          },
          {
            title: (
              <Typography>
                <UserOutlined style={{ paddingRight: 4 }} />
                Người dùng
              </Typography>
            ),
            href: "/users",
          },
          {
            title: "Chỉnh sửa",
          },
        ],
      }}
    />
  );
  return (
    <Edit
      resource="users"
      title="Chỉnh sửa thông tin người dùng"
      isLoading={formLoading || isLoadingEditUser}
      footerButtons={renderFooterEditUser}
      headerButtons={renderHeaderEditUser}
      breadcrumb={renderBreadcrumbEditUser}
    >
      <Card className="card-custom">
        <FormUser
          formProps={formProps}
          isEdit={true}
          handleFieldsChange={handleFieldsChange}
          changedFields={changedFieldEditUsers}
          onFinish={submitRequestEditUser}
        />
      </Card>
    </Edit>
  );
};
