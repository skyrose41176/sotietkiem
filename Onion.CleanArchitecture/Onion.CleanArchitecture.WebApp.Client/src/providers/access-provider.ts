import { AccessControlProvider } from "@refinedev/core";
import { authProvider } from "./auth-provider";
import { Roles } from "./types";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    if (!authProvider || typeof authProvider.getPermissions !== "function") {
      return {
        can: false,
        reason: "AuthProvider or getPermissions is undefined",
      };
    }
    const roles = (await authProvider.getPermissions()) as Roles;
    if (!roles) {
      return {
        can: false,
        reason: "No permissions found",
      };
    }
    for (const permission of roles as any) {
      if (
        permission.action === action &&
        permission.resource.includes(resource)
      ) {
        return { can: true };
      }
    }

    return {
      can: false,
      reason: "Unauthorized",
    };
  },
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },
};
