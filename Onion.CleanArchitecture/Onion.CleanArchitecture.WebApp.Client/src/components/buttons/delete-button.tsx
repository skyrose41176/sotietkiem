import { DeleteButton } from "@refinedev/antd";

type DeleteButtonCustomProps = {
  Id: number | string;
  Name: string;
};
export const DeleteButtonCustom = ({
  Id,
  Name,
}: Readonly<DeleteButtonCustomProps>) => {
  return (
    <DeleteButton
      hideText
      size="small"
      recordItemId={Id}
      confirmTitle="Bạn có chắc chắn muốn xóa?"
      confirmOkText="Xóa"
      confirmCancelText="Hủy"
      successNotification={{
        message: `Xóa ${Name} thành công`,
        type: "success",
        description: "Thành công",
      }}
    />
  );
};
