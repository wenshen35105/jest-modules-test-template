import axios from "axios";
import * as config from "./config";

export const getPlatformRrequestClient = () => {
  const platformConfig = config.getPlatformConfig();

  const axiosClient = axios.create({
    baseURL: `${platformConfig.schema}://${platformConfig.host}:${platformConfig.port}`,
  });

  return axiosClient;
};
