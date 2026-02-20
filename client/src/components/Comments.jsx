import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import api from "../utils/api";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const [replyTo, setReplyTo] = useState(null);
  const [content, setContent] = useState("");
  const [allComments, setAllComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comment/${postId}`);
        const nextComments = response.data?.comments || [];
        setComments(nextComments);
        setAllComments(nextComments);
      } catch (error) {
        console.error("Failed to load comments", error);
        setComments([]);
        setAllComments([]);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    const payload = {
      content: content.trim(),
      postId: postId,
    };

    if (replyTo) {
      payload.parentId = replyTo;
    }

    const response = await api.post("/comment", payload);
    const newComment = response.data;

    if (replyTo) {
      const addReply = (commentsList) =>
        commentsList.map((c) => {
          if (c.id === replyTo) {
            return { ...c, replies: [...(c.replies || []), newComment] };
          }
          if (c.replies?.length) {
            return { ...c, replies: addReply(c.replies) };
          }
          return c;
        });

      setAllComments(addReply(allComments));
    } else {
      setAllComments([...allComments, newComment]);
    }

    setContent("");
    setReplyTo(null);
  };

  return (
    <div className="mt-4 max-h-96 overflow-y-auto">
      {(allComments || []).map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={setReplyTo}
          replyTo={replyTo}
          content={content}
          setContent={setContent}
          onSubmit={handleSubmit}
        />
      ))}

      {!replyTo && (
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            U
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            name="content"
            className="flex-1 px-3 py-2 bg-transparent border-none text-sm focus:outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-3 py-1 text-blue-500 text-sm font-medium disabled:text-gray-300 disabled:cursor-not-allowed hover:text-blue-600"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

function CommentItem({
  comment,
  onReply,
  replyTo,
  content,
  setContent,
  onSubmit,
  depth = 0,
}) {
  const isReplyingToThis = replyTo === comment.id;

  return (
    <div className={`flex gap-3 mt-3 ${depth > 0 ? "ml-8" : ""}`}>
      <div className="flex-shrink-0">
        <div
          className={`bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium ${
            depth === 0 ? "w-8 h-8 text-xs" : "w-6 h-6 text-xs"
          }`}
        >
          {comment.user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>

      <div className="flex-1">
        {comment.text && (
          <>
            <div>
              <span className="font-semibold text-sm text-gray-900">
                {comment.user?.username || "user"}
              </span>
              <span className="text-sm text-gray-700 ml-1">{comment.text}</span>
            </div>

            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <button
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
                onClick={() => onReply(comment.id)}
              >
                Reply
              </button>
              <button className="text-xs font-medium text-gray-500 hover:text-gray-700">
                Like
              </button>
            </div>
          </>
        )}

        {isReplyingToThis && (
          <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
            <div
              className={`bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium ${
                depth === 0 ? "w-6 h-6 text-xs" : "w-5 h-5 text-xs"
              }`}
            >
              U
            </div>
            <input
              type="text"
              placeholder={`Reply to ${comment.user?.username}...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 px-2 py-1 border-b border-gray-300 text-sm focus:outline-none focus:border-gray-600 bg-transparent"
              autoFocus
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="text-xs text-blue-500 font-medium disabled:text-gray-300"
            >
              Post
            </button>
            <button
              type="button"
              onClick={() => onReply(null)}
              className="text-xs text-gray-400"
            >
              Cancel
            </button>
          </form>
        )}

        {comment.replies?.length > 0 && (
          <div className="mt-3 space-y-2">
            {comment.replies.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                onReply={onReply}
                replyTo={replyTo}
                content={content}
                setContent={setContent}
                onSubmit={onSubmit}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comments;
