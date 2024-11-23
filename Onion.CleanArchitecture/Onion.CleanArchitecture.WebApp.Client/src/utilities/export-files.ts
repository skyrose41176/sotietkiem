import { saveAs } from "file-saver";
export const handleExport = (mutate: any, token: any, url: any) => {
  mutate(
    {
      url,
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
        console.log("data :", data?.data?.FileDownloadName);
        const byteCharacters = atob(data.data.FileContents);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: data.data.ContentType });
        saveAs(blob, `${data?.data?.FileDownloadName}`);
      },
      onError: (error: any) => {
        console.error("Error Exporting:", error);
      },
    }
  );
};
