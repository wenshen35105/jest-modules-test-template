import { getAuthConfig } from "@lib/core/src/config";
import axios from "axios";

export const getUrl = (): URL => {
  const authConfig = getAuthConfig();
  return new URL(
    `${authConfig.schema}://${authConfig.host}:${authConfig.port}`
  );
};

export const getRequestClient = () => {
  return axios.create({
    url: getUrl().toString(),
  });
};
