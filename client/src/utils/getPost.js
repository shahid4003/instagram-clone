import api from "./api";

export const feedPosts = async ({ take, lastCursor }) => {
  const response = await api.get("/feed", {
    params: { take, lastCursor },
  });
  return response?.data;
};
