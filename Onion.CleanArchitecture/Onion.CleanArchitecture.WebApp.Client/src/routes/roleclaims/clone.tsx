import { useForm, Create } from "@refinedev/antd";
import { RoleClaim } from "./types";
import { FormContent } from "./components/form-content";

export const CloneRoleClaim = () => {
  const { formProps, saveButtonProps } = useForm<RoleClaim>({
    redirect: "list",
  });

  return (
    <Create
      resource="roleclaims"
      title="Clone Role Claim"
      saveButtonProps={saveButtonProps}
    >
      <FormContent formProps={formProps} />
    </Create>
  );
};
