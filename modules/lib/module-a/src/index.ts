import { getPlatformConfig } from "@lib/core/src/config";
import axios from "axios";

export const getUrl = (): URL => {
  const platformConfig = getPlatformConfig();
  return new URL(
    `${platformConfig.schema}://${platformConfig.host}:${platformConfig.port}`
  );
};

export const getRequestClient = () => {
  return axios.create({
    baseURL: getUrl().toString(),
  });
};
