import api from "./api";

export const uploadMedia = async (file, postIdToUse, user, avatar = false, story = false,) => {
  let key;
  if (avatar) {
    key = `avatar-${user.username}-${Date.now()}`.replace(/\s+/g, "_");
  } else if (story) {
    key = `story-${user.username}-${Date.now()}-${file.name}`.replace(/\s+/g, "_");
  } else {
    key = `${postIdToUse}-${file.name}`.replace(/\s+/g, "_");
  }

  const s3Key = avatar
    ? `avatars/${user.username}/${key}`
    : story
    ? `stories/${user.username}/${postIdToUse}/${key}`
    : `posts/${user.username}/${postIdToUse}/${key}`;

  const res = await api.post("/s3/upload", {
    key,
    content_type: file.type,
    username: user.username,
    postId: postIdToUse,
    avatar: avatar || false,
    story: story || false,
    storyId: story ? postIdToUse : null
  });
  const { signedUrl, fileLink } = res.data.data;

  const uploadRes = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error("S3 upload failed");

  const resS3 = await api.get(
    `/s3/url/${encodeURIComponent(s3Key)}`
  );
  const { url: fileUrl } = resS3.data;
  let imageUrl = null;
  let videoUrl = null;

  if (file.type.startsWith("image/")) {
    imageUrl = fileUrl;
  } else if (file.type.startsWith("video/")) {
    videoUrl = fileUrl;
  }
  if (avatar) {
    await api.put("/user/me", { img: imageUrl });
  } else if (story) {
    await api.put(`/story/${postIdToUse}/media`, { image: imageUrl, video: videoUrl });
  } else {
    await api.put(`/post/${postIdToUse}/media`, { image: imageUrl, video: videoUrl });
  }
};
