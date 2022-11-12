import { api } from "./config";

export const updateprofileinfo = async (username, newavatar, description) => {
  return await api.put(
    "/settingsinfo/updateprofileinfo",
    {
      username,
      avatar: newavatar,
      description,
    },

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
