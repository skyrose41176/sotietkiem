import type { IResourceItem } from "@refinedev/core";

import {
  DashboardOutlined,
  PicLeftOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/dashboard",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "identity",
    list: "/identity",
    meta: {
      canDelete: true,
      label: "Phân quyền",
      icon: <UserOutlined />,
    },
  },
  {
    name: "setting",
    list: "/setting",
    meta: {
      canDelete: true,
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
  },
  {
    name: "products",
    list: "/products",
    create: "/products/create",
    edit: "/products/:id/edit",
    show: "/products/:id",
    meta: {
      canDelete: true,
      label: "Products",
      icon: <UserOutlined />,
    },
  },

  {
    name: "users",
    list: "/users",
    create: "/users/create",
    clone: "/users/:id/clone",
    edit: "/users/:id/edit",
    show: "/users/:id",
    meta: {
      canDelete: true,
      label: "Người dùng",
      icon: <UserOutlined />,
      parent: "identity",
    },
  },
  {
    name: "roles",
    list: "/roles",
    create: "/roles/create",
    clone: "/roles/:id/clone",
    edit: "/roles/:id/edit",
    show: "/roles/:id",
    meta: {
      canDelete: true,
      label: "Nhóm Quyền",
      icon: <UserSwitchOutlined />,
      parent: "identity",
    },
  },
  {
    name: "roleclaims",
    identifier: "data-roleclaims",
    list: "/roleclaims",
    create: "/roleclaims/create",
    clone: "/roleclaims/:id/clone",
    edit: "/roleclaims/:id/edit",
    show: "/roleclaims/:id",
    meta: {
      canDelete: true,
      label: "Vai Trò",
      icon: <TeamOutlined />,
      parent: "identity",
    },
  },
  {
    name: "policy",
    list: "/policy",
    create: "/policy/create",
    edit: "/policy/:id/edit",
    meta: {
      canDelete: true,
      label: "Policy",
      icon: <PicLeftOutlined />,
      parent: "setting",
    },
  },
];
