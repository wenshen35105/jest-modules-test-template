import axios from "axios";

export const getCar = (baseUrl: URL) => {
  return axios.get(new URL("/car", baseUrl).toString(), {
    validateStatus: () => true,
  });
};
