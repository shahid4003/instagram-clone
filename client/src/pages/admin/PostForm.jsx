import { useState, useRef } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import EmojiPicker from "emoji-picker-react";
import useFetch from "../../hooks/UseFetch";
import { uploadMedia } from "../../utils/uploadtos3";
import { toast } from "sonner";
import api from "../../utils/api";

const PostForm = () => {
  const [preview, setPreview] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const { data, loading } = useFetch({ url: "/user/me" });

  const handleMediaChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    if (selectedFile.type.startsWith("image/")) {
      setMediaType("image");
    } else if (selectedFile.type.startsWith("video/")) {
      setMediaType("video");
    }
  };

  const handlePost = async () => {
    if (!data.user) return;
    const post = await api.post("/post/new", {
      userId: data.user.id,
      caption: caption,
    });
    const postResult = post.data;

    const postId = postResult.data.id;
    if (file) {
      uploadMedia(file, postId, data.user);
    }
    toast.success("Post created successfully!");
    setCaption("");
    setFile(null);
    setPreview(null);
  };

  const textareaRef = useRef(null);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-white text-center mt-12">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-center items-start md:mt-12 px-2 md:px-4 pt-4 md:pt-0 min-h-screen">
        <div className="w-full max-w-md bg-[#0f0f0f] border border-[#262626] rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
            <button className="text-sm font-medium text-gray-400 hover:text-white transition">
              Cancel
            </button>
            <h2 className="text-sm font-semibold text-white">
              Create new post
            </h2>
            <button
              onClick={handlePost}
              disabled={!file}
              className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
          <div className="aspect-square flex items-center justify-center bg-black w-full">
            {preview ? (
              mediaType === "video" ? (
                <video
                  src={preview}
                  controls
                  className="object-cover w-full h-full max-h-[50vh] md:max-h-none"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full max-h-[50vh] md:max-h-none"
                />
              )
            ) : (
              <label className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-gray-300 transition p-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 md:w-12 md:h-12 mb-4 md:mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 16l4-4a3 5 0 017 0l4 4M5 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-base md:text-sm font-medium">Click to upload</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleMediaChange}
                />
              </label>
            )}
          </div>
          <div className="relative p-4 space-y-3">
            <textarea
              ref={textareaRef}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full resize-none bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-xl hover:opacity-80 absolute top-4 right-4"
            >
              😄
            </button>

            {showEmojis && (
              <div className="absolute top-20 right-4 z-50">
                <EmojiPicker
                  theme="dark"
                  onEmojiClick={(emoji) => {
                    setCaption((prev) => prev + emoji.emoji);
                    textareaRef.current?.focus();
                    setShowEmojis(false);
                  }}
                  searchDisabled
                  skinTonesDisabled={false}
                  height={350}
                  width={300}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PostForm;
