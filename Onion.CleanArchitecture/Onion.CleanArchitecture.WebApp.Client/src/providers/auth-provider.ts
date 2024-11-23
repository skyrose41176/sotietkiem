import { AuthProvider as BaseAuthProvider, HttpError } from "@refinedev/core";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { ResponseRoot } from "./types";
import { JwtTokenDecoded } from "@routes/authens";
interface ResponseAuthen {
  Succeeded: boolean;
  Message: string;
  Errors: any;
  Data: any;
}

interface RefreshTokenResponse {
  AccessToken: string;
  RefreshToken: string;
}

interface AuthProvider extends BaseAuthProvider {
  refresh: () => Promise<{ success: boolean }>;
  loginJwt: ({ jwtoken }: { jwtoken: string }) => Promise<{ success: boolean }>;
  loginAd: ({ userAd }: { userAd: string }) => Promise<{ success: boolean }>;
}

export const authProvider: AuthProvider = {
  check: async () => {
    // Get the current URL
    const urlCheck = new URL(window.location.href);
    const pathCheck = window.location.pathname;
    // Get the query parameters
    const paramsCheck = new URLSearchParams(urlCheck.search);
    const jwtokenCheck = paramsCheck.get("jwtoken");
    if (jwtokenCheck && pathCheck === "/authen") {
      await authProvider.loginJwt({ jwtoken: jwtokenCheck });
    }

    const tokenCheck = localStorage.getItem("access_token");
    if (tokenCheck) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Not authenticated",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getIdentity: async () => {
    const responseGetIdentity = await fetch("/api/account/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
      },
    });

    if (responseGetIdentity.status < 200 || responseGetIdentity.status > 299) {
      localStorage.removeItem("access_token");
    }

    const data = (await responseGetIdentity.json()) as ResponseRoot;
    if (!data.Succeeded) {
      const errorResponseAuth =
        (await responseGetIdentity.json()) as ResponseRoot;
      const error: HttpError = {
        message: errorResponseAuth.Message,
        statusCode: errorResponseAuth.Code,
      };
      return Promise.reject(new Error(error.message ?? "Đã xảy ra lỗi"));
    }
    return data.Data as any;
  },
  login: async ({ email, password }) => {
    localStorage.removeItem("access_token");
    const responseLogin = await fetch("/api/account/authenticate-2", {
      method: "POST",
      body: JSON.stringify({ Email: email, Password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dataLogin = (await responseLogin.json()) as ResponseAuthen;
    if (dataLogin.Succeeded) {
      if (dataLogin.Data.JWToken) {
        localStorage.setItem("access_token", dataLogin.Data.JWToken);
        localStorage.setItem(
          "roles",
          JSON.stringify(dataLogin.Data.Permission.permissions)
        );
        return {
          success: true,
          successNotification: {
            message: "Login Successful",
            description: "You have been successfully logged in.",
          },
          redirectTo: "/dashboard",
        };
      }
    }

    return {
      success: false,
      error: {
        name: "Login Failed!",
        message: dataLogin.Message ?? "Invalid email or password",
      },
    };
  },
  loginAd: async ({ userAd }) => {
    localStorage.removeItem("access_token");
    const responseLoginAd = await fetch("/api/account/authenticate-ad", {
      method: "POST",
      body: JSON.stringify({ UserAd: userAd }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dataLoginAd = (await responseLoginAd.json()) as ResponseAuthen;
    if (dataLoginAd.Succeeded) {
      if (dataLoginAd.Data.JWToken) {
        localStorage.setItem("access_token", dataLoginAd.Data.JWToken);
        return {
          success: true,
          successNotification: {
            message: "Login Successful",
            description: "You have been successfully logged in.",
          },
          redirectTo: "/dashboard",
        };
      }
    }

    return {
      success: false,
      error: {
        name: "Login Failed!",
        message: dataLoginAd.Message ?? "Invalid email or password",
      },
    };
  },
  loginJwt: async ({ jwtoken }) => {
    if (jwtoken) {
      try {
        jwtDecode<JwtPayload>(jwtoken);
        localStorage.setItem("access_token", jwtoken);
        return {
          success: true,
          successNotification: {
            message: "Login Successful",
            description: "You have been successfully logged in.",
          },
          redirectTo: "/dashboard",
        };
      } catch (error) {
        return {
          success: false,
          error: {
            name: "Login Failed!",
            message: "Invalid token",
            error,
          },
        };
      }
    }
    return Promise.reject(new Error("No token provided"));
  },
  logout: async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    return { success: true };
  },
  onError: async (error) => {
    return { error };
  },
  getPermissions: async () => {
    const roles = JSON.parse(localStorage.getItem("roles") as string);
    if (!roles) {
      return [];
    }

    return roles;
  },
  updatePassword: async ({ oldPassword, newPassword }) => {
    const responseUpdatePassword = await fetch("/api/account/update-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
      },
    });

    const dataUpdatePassword =
      (await responseUpdatePassword.json()) as ResponseRoot;
    if (dataUpdatePassword.Succeeded) {
      return {
        success: true,
        successNotification: {
          message: "Password Updated",
          description: "Your password has been successfully updated.",
        },
        redirectTo: "/dashboard",
      };
    }
    return {
      success: false,
      error: {
        name: "Login Failed!",
        message: dataUpdatePassword.Message ?? "Invalid email or password",
      },
    };
  },
  refresh: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");
    const responseRefresh = await fetch("/api/account/refresh-token", {
      method: "POST",
      body: JSON.stringify({
        AccessToken: accessToken,
        RefreshToken: refreshToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (responseRefresh.ok) {
      const dataRefresh =
        (await responseRefresh.json()) as RefreshTokenResponse;
      localStorage.setItem("access_token", dataRefresh.AccessToken);
      localStorage.setItem("refresh_token", dataRefresh.RefreshToken);
      return { success: true };
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return { success: false };
    }
  },
};
