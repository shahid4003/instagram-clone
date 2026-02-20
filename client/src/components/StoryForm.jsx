import { useState, useRef, } from "react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";
import useFetch from "../hooks/UseFetch";
import { uploadMedia } from "../utils/uploadtos3";
import api from "../utils/api";

const StoryForm = ({ onClose }) => {
  const { data } = useFetch({ url: "/user/me" });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [caption, setCaption] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const textareaRef = useRef(null);

  const handleMediaChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));

    if (selected.type.startsWith("image/")) setMediaType("image");
    if (selected.type.startsWith("video/")) setMediaType("video");
  };

  const handleShare = async () => {
    if (!file) return;

    if (!data || !data.user || !data.user.id) {
      toast.error("User data not loaded. Please try again.");
      return;
    }

    const post = await api.post("/story/new", {
      userId: data.user.id,
    });
    const storyResult = post.data;
    console.log("Story created:", storyResult);

    const storyId = storyResult.story.id;
    console.log("Story ID:", storyId);
    console.log("User data:", data.user);

    if (file) {
      // Make sure user has required fields
      const userWithDefaults = {
        ...data.user,
        username: data.user.username || "user",
        id: data.user.id,
      };
      await uploadMedia(file, storyId, userWithDefaults, false, true);
    }

    toast.success("Story uploaded!");
    setFile(null);
    setPreview(null);
    setCaption("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-sm h-full max-h-[95vh] aspect-[9/16] bg-black overflow-hidden rounded-xl shadow-2xl">

        {/* Story Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 px-2 pt-2">
          <div className="w-full h-[3px] bg-white/30 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Top Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent z-20" />

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent z-20" />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-6">
          <button
            onClick={onClose}
            className="text-white text-2xl font-light"
          >
            ✕
          </button>

          <button
            onClick={handleShare}
            disabled={!file}
            className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold disabled:opacity-40"
          >
            Submit
          </button>
        </div>

        {/* Media Section */}
        <div className="w-full h-full flex items-center justify-center">

          {preview ? (
            mediaType === "video" ? (
              <video
                src={preview}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="story"
              />
            )
          ) : (
            <label className="flex flex-col items-center justify-center text-white cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md">
                <span className="text-5xl">＋</span>
              </div>
              <span className="text-sm tracking-wide">Create story</span>
              <input
                type="file"
                accept="image/*,video/*"
                hidden
                onChange={handleMediaChange}
              />
            </label>
          )}
        </div>

        {preview && (
          <div className="absolute bottom-6 left-0 right-0 z-30 px-4">
            <textarea
              ref={textareaRef}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Type something..."
              rows={1}
              className="w-full bg-transparent text-white text-center placeholder-white/60 outline-none resize-none text-xl font-semibold mb-6"
            />

            <div className="flex justify-center gap-6">

              <button
                onClick={() => setShowEmojis(!showEmojis)}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl text-white"
              >
                😊
              </button>

              <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl text-white">
                🎵
              </button>

              <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-lg text-white font-bold">
                Aa
              </button>

              <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl text-white">
                📎
              </button>

            </div>
          </div>
        )}
        {showEmojis && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50">
            <EmojiPicker
              theme="dark"
              height={350}
              width={320}
              onEmojiClick={(emoji) => {
                setCaption((prev) => prev + emoji.emoji);
                textareaRef.current?.focus();
                setShowEmojis(false);
              }}
            />
          </div>
        )}

      </div>
    </div>
  );

};

export default StoryForm;
