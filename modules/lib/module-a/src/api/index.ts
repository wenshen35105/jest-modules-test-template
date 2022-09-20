import axios from "axios";

export const getAnimal = (baseUrl: URL) => {
  return axios.get(new URL("/animal", baseUrl).toString(), {
    validateStatus: () => true,
  });
};
