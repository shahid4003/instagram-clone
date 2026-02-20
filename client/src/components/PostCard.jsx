import { useEffect, useState } from "react";
import Comments from "./Comments";

const PostCard = ({ post, user }) => {
  const postUser = post.user;
  const userName = postUser?.username || postUser?.name || "user";
  const userImg = postUser?.img;
  const normalizedUserImg =
    typeof userImg === "string" && userImg.trim().length > 0
      ? userImg
      : null;
  const normalizedImage =
    typeof post.image === "string" && post.image.trim().length > 0
      ? post.image
      : null;
  const normalizedVideo =
    typeof post.video === "string" && post.video.trim().length > 0
      ? post.video
      : null;
  const [like, setLike] = useState(
    post.likes?.some((like) => like.userId === user?.id) || false,
  );
  const [totalLikes, setTotalLikes] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const handleLike = async () => {
    if (!like) {
      const req = await fetch(`/api/post/like/${post.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include"
        },
      });
      if (req.ok) {
        setTotalLikes((prev) => prev + 1);
        setLike(true);
      }
    } else {
      const req = await fetch(`/api/post/unlike/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (req.ok) {
        setTotalLikes((prev) => prev - 1);
        setLike(false);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 ">
        <div className="flex items-center space-x-3">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={
              normalizedUserImg ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=80"
            }
            alt="User Avatar"
          />
          <span className="text-sm font-semibold text-gray-900 ">
            {userName}
          </span>
        </div>
        <button aria-label="More options" className="text-gray-900 ">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
          </svg>
        </button>
      </div>
      <div>
        {normalizedImage && (
          <img
            className="w-full object-cover"
            src={normalizedImage}
            alt="Post Content"
          />
        )}
        {normalizedVideo && (
          <video
            className="w-full object-cover"
            controls
            src={normalizedVideo}
          ></video>
        )}
      </div>

      <div className="flex justify-between items-center px-2 py-2">
        <div className="flex ">
          <button
            aria-label="Like post"
            onClick={handleLike}
            className="text-gray-900 flex items-center justify-center gap-2 hover:text-gray-500 "
          >
            <svg
              className="w-6 h-6"
              fill={like ? "red" : "none"}
              stroke={like ? "red" : "currentColor"}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            <p className="text-sm font-semibold text-gray-900 ">
              {totalLikes || 0}
            </p>
          </button>
          <button
            aria-label="Comment on post"
            onClick={() => setShowComments((prev) => !prev)}
            className="text-gray-900  hover:text-gray-500 "
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.2881437,19.1950792 C8.38869181,19.1783212 8.49195996,19.1926955 8.58410926,19.2362761 C9.64260561,19.7368747 10.8021412,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 C7.581722,4 4,7.581722 4,12 C4,13.7069096 4.53528582,15.3318588 5.51454846,16.6849571 C5.62010923,16.830816 5.63909672,17.022166 5.5642591,17.1859256 L4.34581002,19.8521348 L8.2881437,19.1950792 Z M3.58219949,20.993197 C3.18698783,21.0590656 2.87870208,20.6565881 3.04523765,20.2921751 L4.53592782,17.0302482 C3.54143337,15.5576047 3,13.818993 3,12 C3,7.02943725 7.02943725,3 12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C10.707529,21 9.4528641,20.727055 8.30053434,20.2068078 L3.58219949,20.993197 Z" />
            </svg>
          </button>
          <button
            aria-label="Share post"
            className="text-gray-900  hover:text-gray-500 "
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 13V17.5C20 20.5577 16 20.5 12 20.5C8 20.5 4 20.5577 4 17.5V13M12 3L12 15M12 3L16 7M12 3L8 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <button
          aria-label="Save post"
          className="text-gray-900  hover:text-gray-500 "
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            ></path>
          </svg>
        </button>
      </div>
      {showComments && (
        <Comments user={user} postId={post.id} />
      )}
      <div className="px-4 pb-2">
        <p className="text-sm text-gray-900 ">
          <a href={`/${userName}`} className="font-semibold hover:underline">
            {userName}
          </a>{" "}
          {post.caption}
        </p>
      </div>

      <div className="px-4 pb-4 border-t border-gray-200  mt-2 pt-3">
        <div className="flex items-center space-x-3">
          <img
            className="w-7 h-7 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=80"
            alt="Your Avatar"
          />
          <p className="text-sm text-gray-400  flex-grow">Add a comment...</p>
          <button className="text-sm font-semibold text-blue-500 hover:text-blue-700  opacity-50 cursor-not-allowed">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
