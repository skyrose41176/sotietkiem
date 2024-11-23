import {
  DataProvider as BaseDataProvider,
  BaseRecord,
  CustomParams,
  CustomResponse,
  HttpError,
} from "@refinedev/core";
import { ResponseManyRoot, ResponseRoot } from "./types";

const API_URL = "/api";

const processErrorResponse = async (response: Response): Promise<never> => {
  const errorResponseProvider = (await response.json()) as ResponseRoot;
  const httpErrorProvider: HttpError = {
    message: errorResponseProvider.Message,
    statusCode: errorResponseProvider.Code,
  };
  return Promise.reject(new Error(httpErrorProvider.message));
};

function handleErrorResponse(errorResponse: ResponseRoot): Promise<never> {
  let errorMessageProvider = errorResponse.Message;
  if (
    Array.isArray(errorResponse.Errors) &&
    errorResponse.Errors.every((item) => typeof item === "string")
  ) {
    errorMessageProvider = errorResponse.Errors.join(" ");
  }
  const httpErrorMessageProvider: HttpError = {
    message: errorMessageProvider,
    statusCode: errorResponse.Code,
  };
  return Promise.reject(new Error(httpErrorMessageProvider.message));
}

const fetcher = async (url: string, options?: RequestInit) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
    },
  });
};

export interface DataProvider extends BaseDataProvider {
  getApiUrl(): string;
  deleteFile(publicId: string): void;
  getUserLdap(username: string): any;
}

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const paramsgGetListProvider = new URLSearchParams();
    if (pagination) {
      paramsgGetListProvider.append(
        "_start",
        (
          ((pagination?.current ?? 1) - 1) *
          (pagination?.pageSize ?? 0)
        ).toString()
      );
      paramsgGetListProvider.append(
        "_end",
        ((pagination?.current ?? 1) * (pagination?.pageSize ?? 0)).toString()
      );
    }

    if (sorters && sorters.length > 0) {
      paramsgGetListProvider.append(
        "_sort",
        sorters.map((sorter) => sorter.field).join(",")
      );
      paramsgGetListProvider.append(
        "_order",
        sorters.map((sorter) => sorter.order).join(",")
      );
    }

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ("field" in filter && filter.operator === "eq") {
          paramsgGetListProvider.append(
            "_filter",
            `${filter.field}:${filter.value}`
          );
        }
        if ("field" in filter && filter.operator === "in") {
          if (typeof filter.value[0] === "number") {
            paramsgGetListProvider.append(
              "_filter",
              `${filter.field}:${filter.value.join(",")}`
            );
          } else {
            const start = filter.value[0];
            const end = filter.value[1];
            if (start && end) {
              const startDateProvider = `${start.$y}-${start.$M + 1}-${
                start.$D
              }`;
              const endDateProvider = `${end.$y}-${end.$M + 1}-${end.$D}`;
              paramsgGetListProvider.append(
                "_filter",
                `${filter.field}:${startDateProvider}#${endDateProvider}`
              );
            }
          }
        }
      });
    }

    const responseProvider = await fetcher(
      `${API_URL}/${resource}?${paramsgGetListProvider.toString()}`
    );

    if (responseProvider.status === 401) {
      return processErrorResponse(responseProvider);
    }

    if (!responseProvider.ok) {
      const errorResponseProdider =
        (await responseProvider.json()) as ResponseRoot;
      return handleErrorResponse(errorResponseProdider);
    }

    const dataResponseProvider =
      (await responseProvider.json()) as ResponseRoot;
    if (!dataResponseProvider.Succeeded) {
      const errorDataResponseProvider: HttpError = {
        message: dataResponseProvider.Message,
        statusCode: dataResponseProvider.Code,
      };
      return Promise.reject(new Error(errorDataResponseProvider.message));
    }

    const totalProvider = dataResponseProvider.Data._total;
    return {
      data: dataResponseProvider.Data._data,
      total: totalProvider,
    };
  },
  getOne: async ({ resource, id }) => {
    const responseGetOneProvider = await fetcher(
      `${API_URL}/${resource}/show/${id}`
    );

    if (responseGetOneProvider.status === 401) {
      return processErrorResponse(responseGetOneProvider);
    }

    if (!responseGetOneProvider.ok) {
      const errorResponseGetOneProvider =
        (await responseGetOneProvider.json()) as ResponseRoot;
      return handleErrorResponse(errorResponseGetOneProvider);
    }
    const dataGetOneProvider =
      (await responseGetOneProvider.json()) as ResponseRoot;
    return { data: dataGetOneProvider.Data as any };
  },
  getMany: async ({ resource, ids }) => {
    const paramsGetManyProvider = new URLSearchParams();
    if (ids && ids.length > 0) {
      ids.forEach((id) => paramsGetManyProvider.append("id", String(id)));
      const responseGetManyProvider = await fetcher(
        `${API_URL}/${resource}?${paramsGetManyProvider.toString()}`
      );

      if (responseGetManyProvider.status === 401) {
        return processErrorResponse(responseGetManyProvider);
      }

      if (!responseGetManyProvider.ok) {
        return processErrorResponse(responseGetManyProvider);
      } else {
        const dataGetManyProvider =
          (await responseGetManyProvider.json()) as ResponseManyRoot;
        return { data: dataGetManyProvider?.Data ?? [] };
      }
    }
    return { data: [] };
  },
  create: async ({ resource, variables }) => {
    const responseCreateProvider = await fetcher(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (responseCreateProvider.status === 401) {
      return processErrorResponse(responseCreateProvider);
    }

    if (!responseCreateProvider.ok) {
      const errorResponseCreateProvider =
        (await responseCreateProvider.json()) as ResponseRoot;
      return handleErrorResponse(errorResponseCreateProvider);
    }
    const dataCreateProvider =
      (await responseCreateProvider.json()) as ResponseRoot;
    return { data: dataCreateProvider.Data as any };
  },
  createMany: async ({ resource, variables }) => {
    variables = variables as any[];

    const responseCreateManyProvider = await fetcher(
      `${API_URL}/${resource}/range`,
      {
        method: "POST",
        body: JSON.stringify(variables),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseCreateManyProvider.status === 401) {
      return processErrorResponse(responseCreateManyProvider);
    }

    if (!responseCreateManyProvider.ok) {
      const errorResponseCreateManyProvider =
        (await responseCreateManyProvider.json()) as ResponseManyRoot;
      const httpErrorCreateManyProvider: HttpError = {
        message: errorResponseCreateManyProvider.Message,
        statusCode: errorResponseCreateManyProvider.Code,
      };
      return Promise.reject(new Error(httpErrorCreateManyProvider.message));
    }
    const dataCreateManyProvider =
      (await responseCreateManyProvider.json()) as ResponseManyRoot;
    return { data: dataCreateManyProvider.Data as any };
  },
  update: async ({ resource, id, variables }) => {
    const responseUpdateProvider = await fetcher(
      `${API_URL}/${resource}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(variables),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseUpdateProvider.status === 401) {
      return processErrorResponse(responseUpdateProvider);
    }

    if (!responseUpdateProvider.ok) {
      const errorResponseUpdateProvider =
        (await responseUpdateProvider.json()) as ResponseRoot;
      const httpErrorUpdateProvider: HttpError = {
        message: errorResponseUpdateProvider.Message,
        statusCode: errorResponseUpdateProvider.Code,
      };
      return Promise.reject(new Error(httpErrorUpdateProvider.message));
    }
    const dataUpdateProvider =
      (await responseUpdateProvider.json()) as ResponseRoot;
    return { data: dataUpdateProvider.Data as any };
  },
  deleteOne: async ({ resource, id }) => {
    const responseDeleteOneProvider = await fetcher(
      `${API_URL}/${resource}/${id}`,
      {
        method: "DELETE",
      }
    );

    if (responseDeleteOneProvider.status === 401) {
      return processErrorResponse(responseDeleteOneProvider);
    }

    if (!responseDeleteOneProvider.ok) {
      const errorResponseDeleteOneProvider =
        (await responseDeleteOneProvider.json()) as ResponseRoot;
      const httpErrorDeleteOneProvider: HttpError = {
        message: errorResponseDeleteOneProvider.Message,
        statusCode: errorResponseDeleteOneProvider.Code,
      };
      return Promise.reject(new Error(httpErrorDeleteOneProvider.message));
    }
    const dataDeleteOneProvider =
      (await responseDeleteOneProvider.json()) as ResponseRoot;
    return { data: dataDeleteOneProvider.Data as any };
  },

  getApiUrl: function (): string {
    throw new Error("Function not implemented.");
  },
  deleteFile: (publicId) => {
    fetcher(`${API_URL}/file?publicId=${publicId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(() => {
      throw new Error("Failed to delete file");
    });
  },
  getUserLdap: async (username: string) => {
    const responseGetUserLdapProvider = await fetcher(
      `${API_URL}/users/user-ldap?username=${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseGetUserLdapProvider.status === 401) {
      return processErrorResponse(responseGetUserLdapProvider);
    }

    if (!responseGetUserLdapProvider.ok) {
      const errorResponseGetUserLdapProvider =
        (await responseGetUserLdapProvider.json()) as ResponseRoot;
      const errorGetUserLdapProvider: HttpError = {
        message: errorResponseGetUserLdapProvider.Message,
        statusCode: errorResponseGetUserLdapProvider.Code,
      };
      return Promise.reject(new Error(errorGetUserLdapProvider.message));
    }
    const dataG = (await responseGetUserLdapProvider.json()) as ResponseRoot;
    return { data: dataG.Data as any };
  },
  custom: async <
    TData extends BaseRecord = BaseRecord,
    TQuery = unknown,
    TPayload = unknown
  >({
    url,
    method,
    headers,
    payload,
  }: CustomParams<TQuery, TPayload>): Promise<CustomResponse<TData>> => {
    const responseCustomProvider = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload),
    });
    if (responseCustomProvider.status === 401) {
      return processErrorResponse(responseCustomProvider);
    }
    if (!responseCustomProvider.ok) {
      return processErrorResponse(responseCustomProvider);
    }
    const dataCustomProvider =
      (await responseCustomProvider.json()) as ResponseManyRoot;
    return { data: dataCustomProvider.Data as any };
  },
};
