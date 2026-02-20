import api from "./api";

export const feedPosts = async ({ take, lastCursor }) => {
  console.log("Fetching feed posts with:", take, lastCursor);
  const response = await api.get("/feed", {
    params: { take, lastCursor },
  });
  return response?.data;
};
