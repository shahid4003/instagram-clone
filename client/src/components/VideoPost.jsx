import { useState } from "react";

const VideoPost = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="relative group cursor-pointer overflow-hidden w-full h-0 pb-full"
        onClick={() => setIsModalOpen(true)}
      >
        <video
          className="absolute top-0 left-0 w-full h-full object-cover transform duration-300 group-hover:scale-105"
          src={post.video}
          playsInline
          preload="metadata"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-900 rounded max-w-3xl w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={post.video}
              autoPlay
              className="w-full h-auto object-cover"
            />
            {post.caption && (
              <div className="p-4 text-gray-100">{post.caption}</div>
            )}
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white text-2xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPost;
