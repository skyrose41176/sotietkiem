import { ExportButton } from "@refinedev/antd";
import { useCustomMutation } from "@refinedev/core";
import fileSaver from "file-saver";
import React from "react";

interface FileExportButtonProps {
  url: any;
  filters?: any; // Replace 'any' with the appropriate type
}

const ExportFileButton: React.FC<FileExportButtonProps> = ({
  url,
  filters,
}) => {
  const { mutate, isLoading: isLoadingMutate } = useCustomMutation<any>();
  const token = localStorage.getItem("access_token");
  const params = new URLSearchParams();
  filters.forEach((filter: any) => {
    if ("field" in filter && filter.operator === "eq") {
      params.append("_filter", `${filter.field}:${filter.value}`);
    }
    if ("field" in filter && filter.operator === "in") {
      const start = filter.value[0];
      const end = filter.value[1];
      if (start && end) {
        const startDate = `${start.$y}-${start.$M + 1}-${start.$D}`;
        const endDate = `${end.$y}-${end.$M + 1}-${end.$D}`;
        params.append("_filter", `${filter.field}:${startDate}#${endDate}`);
      }
    }
  });

  const handleExport = async () => {
    await mutate(
      {
        url: url + `?${params.toString()}`,
        method: "post",
        values: {},
        config: {
          headers: {
            authorization: "Bearer " + token,
          },
        },
      },
      {
        onSuccess: (data: any) => {
          const byteCharacters = atob(data.data.FileContents);
          const byteNumbers = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const blob = new Blob([byteNumbers], { type: data.data.ContentType });
          fileSaver(blob);
          console.log("Export successfully:", data);
        },
        onError: (error: any) => {
          console.error("Error Exporting:", error);
        },
      }
    );
  };

  return (
    <ExportButton
      type="primary"
      onClick={handleExport}
      disabled={isLoadingMutate}
    />
  );
};

export default ExportFileButton;
