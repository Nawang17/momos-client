import { api } from "./config";

export const updateprofileinfo = async (
  username,
  newavatar,
  description,
  newbanner
) => {
  return await api.put(
    "/settingsinfo/updateprofileinfo",
    {
      username,
      avatar: newavatar,
      description,
      banner: newbanner,
    },

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
