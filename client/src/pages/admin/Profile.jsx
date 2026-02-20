import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Grid,
  PlayIcon,
  UserPlus,
  MoreHorizontal,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Avatar from "../../components/Avatar";
import api from "../../utils/api";

const Profile = () => {
  const { slug } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isSelf, setIsSelf] = useState(false);
  const [listModal, setListModal] = useState({ open: false, type: null });
  const [listData, setListData] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);
  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const [profileRes, meRes] = await Promise.all([
          api.get(`/user/${slug}`),
          api.get("/user/me"),
        ]);

        if (!isMounted) return;

        const profileUser = profileRes.data?.user;
        const me = meRes.data?.user;

        setUser(profileUser);
        setCurrentUser(me);
        setIsSelf(Boolean(profileUser?.id && me?.id && profileUser.id === me.id));
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!listModal.open || !user?.id || !listModal.type) return;

    let isActive = true;

    const fetchList = async () => {
      try {
        setListLoading(true);
        setListError(null);

        const endpoint =
          listModal.type === "followers"
            ? `/follow/followers/${user.id}`
            : `/follow/following/${user.id}`;
        const res = await api.get(endpoint);

        if (!isActive) return;

        const data =
          listModal.type === "followers"
            ? res.data?.followers || []
            : res.data?.following || [];

        setListData(data);
      } catch (error) {
        if (isActive) {
          setListError("Failed to load list.");
        }
      } finally {
        if (isActive) {
          setListLoading(false);
        }
      }
    };

    fetchList();

    return () => {
      isActive = false;
    };
  }, [listModal.open, listModal.type, user?.id]);

  const openListModal = (type) => {
    setListModal({ open: true, type });
  };

  const closeListModal = () => {
    setListModal({ open: false, type: null });
    setListData([]);
    setListError(null);
  };

  if (loading) return <AdminLayout>Loading...</AdminLayout>;
  if (!user) return <AdminLayout>User not found</AdminLayout>;

  let userInfo = {
    name: user?.name || user?.username,
    avatar: user?.img,
    bio: user?.bio || "",
    username: user?.username || "",
    id: user?.id || "",
  };

  const listEntries =
    listModal.type === "followers"
      ? listData.map((entry) => entry.follower).filter(Boolean)
      : listModal.type === "following"
        ? listData.map((entry) => entry.following).filter(Boolean)
        : [];
console.log(user)
  return (
    <AdminLayout showSuggestions={false}>
      <main className="bg-white text-gray-900 min-h-screen border-t border-gray-200">
        <div className="max-w-[975px] mx-auto px-4 md:px-5 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-6 md:mb-8">
            <div className="shrink-0 mb-6 md:mb-0">
              <div className="relative">
                <Avatar userInfo={userInfo} editable={isSelf} />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {/* Username and Actions */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-0">
                  {user.username}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {!isSelf && (
                    <button className="bg-gray-200 hover:bg-gray-300 p-1.5 rounded text-gray-900 text-sm font-medium transition">
                      <UserPlus size={16} />
                    </button>
                  )}
                  <button className="bg-gray-200 hover:bg-gray-300 p-1.5 rounded text-gray-900 text-sm font-medium transition">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <ul className="grid grid-cols-3 gap-3 text-gray-600 mb-4 md:flex md:space-x-10">
                <li className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-gray-900">
                      {user.posts.length}
                    </span>
                    <span className="text-sm">posts</span>
                  </div>
                </li>
                <li className="text-center">
                  <button
                    type="button"
                    onClick={() => openListModal("following")}
                    className="flex flex-col items-center hover:text-gray-900"
                  >
                    <span className="font-semibold text-gray-900">
                      {user.followers.length || 0}
                    </span>
                    <span className="text-sm">  followers</span>
                  </button>
                </li>
                <li className="text-center">
                  <button
                    onClick={() => openListModal("followers")}
                    type="button"
                    className="flex flex-col items-center hover:text-gray-900"
                  >
                    <span className="font-semibold text-gray-900">
                      {user.following.length || 0}
                    </span>
                    <span className="text-sm">following</span>
                  </button>
                </li>
              </ul>

              {/* Bio */}
              <div className="text-gray-600 mb-4">
                <h1 className="font-semibold text-gray-900">{user.name}</h1>
                <p className="whitespace-pre-wrap text-sm mt-1">
                  {user.bio || "This user has no bio."}
                </p>
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm mt-1 block"
                  >
                    {user.website}
                  </a>
                )}
              </div>

              {/* Followed by */}
              {user.followedByUsers && user.followedByUsers.length > 0 && (
                <div className="text-sm text-gray-500">
                  Followed by{" "}
                  {user.followedByUsers
                    .slice(0, 2)
                    .map((followedUser, index) => (
                      <span key={followedUser.id}>
                        <a href={`/${followedUser.username}`} className="text-blue-500 hover:underline">
                          {followedUser.username}
                        </a>
                        {index === 0 && user.followedByUsers.length > 1 && ", "}
                        {index === 1 &&
                          user.followedByUsers.length > 2 &&
                          ` and ${user.followedByUsers.length - 2} others`}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Highlights */}
          {user.highlights && user.highlights.length > 0 && (
            <div className="mt-8 mb-6">
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {user.highlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className="flex flex-col items-center flex-shrink-0"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 mb-1">
                      <div className="w-full h-full rounded-full bg-white p-0.5">
                        <img
                          src={highlight.cover}
                          alt={highlight.title}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 truncate max-w-[70px]">
                      {highlight.title}
                    </span>
                  </div>
                ))}
                {isSelf && (
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center mb-1">
                      <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">New</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TABS */}
          <div className="border-t border-gray-200 py-4">
            <div className="flex justify-center gap-6 md:gap-16 overflow-x-auto">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-4 px-2 border-t-2 transition flex items-center gap-1 ${
                  activeTab === "posts"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid size={12} />
                <span className="text-xs uppercase tracking-wider">Posts</span>
              </button>
              <button
                onClick={() => setActiveTab("reels")}
                className={`py-4 px-2 border-t-2 transition flex items-center gap-1 ${
                  activeTab === "reels"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <PlayIcon size={12} />
                <span className="text-xs uppercase tracking-wider">Reels</span>
              </button>
              <button
                onClick={() => setActiveTab("tagged")}
                className={`py-4 px-2 border-t-2 transition flex items-center gap-1 ${
                  activeTab === "tagged"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs uppercase tracking-wider">Tagged</span>
              </button>
            </div>
          </div>

          {/* CONTENT */}
          {activeTab === "posts" && user.posts.length > 0 && (
            <div className="grid grid-cols-3 gap-1 md:gap-1 mt-1">
              {user.posts
                .filter((post) => post.image || post.video)
                .map((post) => (
                  <div
                    key={post.id}
                    className="relative group cursor-pointer aspect-square"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.caption || "User post"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          key={post.id}
                          src={post.video}
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/50  rounded p-1">
                          <PlayIcon size={12} className="text-white" />
                        </div>
                      </div>
                    )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-transparent group-hover:bg-black/40 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center text-white">
                    <div className="hidden group-hover:flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart size={16} />
                        <span className="text-sm font-semibold">
                          {post.likes || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={16} />
                        <span className="text-sm font-semibold">
                          {post.comments || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  </div>
                ))}
            </div>
          )}

          {activeTab === "reels" && (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <div className="text-center">
                <PlayIcon size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No reels yet</p>
              </div>
            </div>
          )}

          {activeTab === "tagged" && (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>No photos yet</p>
              </div>
            </div>
          )}

          {user.posts.length === 0 && activeTab === "posts" && (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <div className="text-center">
                <Grid size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No posts yet</p>
              </div>
            </div>
          )}
        </div>

        {/* FOLLOWERS/FOLLOWING MODAL */}
        {listModal.open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={closeListModal}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 capitalize">
                  {listModal.type}
                </h3>
                <button
                  type="button"
                  onClick={closeListModal}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {listLoading && (
                  <div className="px-5 py-8 text-center text-sm text-gray-500">
                    Loading...
                  </div>
                )}
                {!listLoading && listError && (
                  <div className="px-5 py-8 text-center text-sm text-red-500">
                    {listError}
                  </div>
                )}
                {!listLoading && !listError && listEntries.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-gray-500">
                    No {listModal.type} yet.
                  </div>
                )}
                {!listLoading && !listError && listEntries.length > 0 && (
                  <div className="divide-y divide-gray-100">
                    {listEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex items-center gap-3">
                          {entry.img ? (
                            <img
                              src={entry.img}
                              alt={entry.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                              {entry.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {entry.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {entry.name || entry.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* POST MODAL */}
        {selectedPost && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="bg-white rounded max-w-5xl w-full max-h-[90vh] overflow-hidden relative flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Post Media */}
              <div className="flex-1 bg-gray-100 flex items-center justify-center">
                {selectedPost.image ? (
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.caption || "Post"}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : selectedPost.video ? (
                  <video
                    className="max-w-full max-h-full"
                    src={selectedPost.video}
                    controls
                    muted
                    playsInline
                    autoPlay
                  />
                ) : (
                  <div className="text-sm text-gray-500">
                    No media available for this post.
                  </div>
                )}
              </div>

              {/* Post Details */}
              <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar || "https://via.placeholder.com/150"}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold text-gray-900">
                      {user.username}
                    </span>
                  </div>
                  <button
                    className="text-gray-500 hover:text-gray-900"
                    onClick={() => setSelectedPost(null)}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Caption */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="mb-4">
                    <span className="font-semibold text-gray-900 mr-2">
                      {user.username}
                    </span>
                    <span className="text-gray-700">
                      {selectedPost.caption}
                    </span>
                  </div>
                  {selectedPost.comments &&
                    selectedPost.comments.length > 0 && (
                      <div className="space-y-3">
                        {selectedPost.comments.map((comment) => (
                          <div key={comment.id}>
                            <span className="font-semibold text-gray-900 mr-2">
                              {comment.username}
                            </span>
                            <span className="text-gray-700">
                              {comment.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <Heart
                        size={24}
                        className="cursor-pointer hover:scale-110 transition"
                      />
                      <MessageCircle
                        size={24}
                        className="cursor-pointer hover:scale-110 transition"
                      />
                      <svg
                        className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"
                        />
                      </svg>
                    </div>
                    <Bookmark
                      size={24}
                      className="cursor-pointer hover:scale-110 transition"
                    />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-2">
                    {selectedPost.likes || 0} likes
                  </p>
                  <p className="text-xs text-gray-500 uppercase">
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default Profile;
