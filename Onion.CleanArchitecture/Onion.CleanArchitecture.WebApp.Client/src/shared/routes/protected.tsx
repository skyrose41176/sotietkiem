import { Dashboard } from "@routes/dashboards";
import {
  CloneUser,
  CreateUser,
  EditUser,
  ListUser,
  ShowUser,
} from "@routes/identity/users";
import { IRoute } from "./types";
import { Unauthorized } from "@components/unauthorized";
import {
  CloneRoleClaim,
  CreateRoleClaim,
  EditRoleClaim,
  ListRoleClaim,
  ShowRoleClaim,
  CloneRole,
  CreateRole,
  EditRole,
  ListRole,
  ShowRole,
  ListProduct,
  CreateProduct,
  EditProduct,
} from "@routes/index";
import CsvReader from "@routes/policy/list";
import { EditPolicies } from "@routes/policy/edit";
import { CreatePolicies } from "@routes/policy";

export const ProtectedRoutes: IRoute[] = [
  {
    path: "dashboard",
    resource: "dashboard",
    children: [{ index: true, action: "list", element: <Dashboard /> }],
  },
  {
    path: "users",
    resource: "users",
    children: [
      { index: true, action: "list", element: <ListUser /> },
      { path: "create", action: "create", element: <CreateUser /> },
      { path: ":id/clone", action: "clone", element: <CloneUser /> },
      { path: ":id/edit", action: "edit", element: <EditUser /> },
      { path: ":id", action: "show", element: <ShowUser /> },
    ],
  },
  {
    path: "roleclaims",
    resource: "roleclaims",
    children: [
      { index: true, action: "list", element: <ListRoleClaim /> },
      { path: "create", action: "create", element: <CreateRoleClaim /> },
      { path: ":id/clone", action: "create", element: <CloneRoleClaim /> },
      { path: ":id/edit", action: "edit", element: <EditRoleClaim /> },
      { path: ":id", action: "show", element: <ShowRoleClaim /> },
    ],
  },
  {
    path: "roles",
    resource: "roles",
    children: [
      { index: true, action: "list", element: <ListRole /> },
      { path: "create", action: "create", element: <CreateRole /> },
      { path: ":id/clone", action: "clone", element: <CloneRole /> },
      { path: ":id/edit", action: "edit", element: <EditRole /> },
      { path: ":id", action: "show", element: <ShowRole /> },
    ],
  },
  {
    path: "policy",
    fallback: <Unauthorized />,
    resource: "policy",
    children: [
      { index: true, action: "list", element: <CsvReader /> },
      { path: "create", action: "create", element: <CreatePolicies /> },
      { path: ":id/edit", action: "edit", element: <EditPolicies /> },
    ],
  },
  {
    path: "products",
    resource: "products",
    children: [
      { index: true, action: "list", element: <ListProduct /> },
      { path: "create", action: "create", element: <CreateProduct /> },
      // { path: 'create-range', action: 'create-range', element: <CreateRangeProduct />, },
      // { path: ':id/clone', action: 'clone', element: <CloneProduct />, },
      { path: ":id/edit", action: "edit", element: <EditProduct /> },
      // { path: ':id', action: 'show', element: <ShowProduct />, },
    ],
  },
];
