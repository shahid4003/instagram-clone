import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../utils/api";

const SuggestedUserSidebar = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await api.get("/user/suggestions");
        setUsers(response.data.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleFollow = async (user) => {
    try {
      const response = await api.post("/follow/follow-user", { followingId: user.id });
      toast.success(`You followed ${user.username} successfully!`);

      // Remove followed user from suggestions
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow user");
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-80 py-6 px-4 ml-8">
      <div>
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white p-0.5">
              <img
                src="https://avatars.githubusercontent.com/u/26464462?v=4"
                alt="Your Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold text-gray-900">shahidaziz</p>
            <p className="text-sm text-gray-500">Shahid Aziz</p>
          </div>
          <button className="text-sm text-blue-500 font-semibold">
            Switch
          </button>
        </div>

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-gray-500 text-sm font-semibold">
            Suggestions for you
          </h2>
          <button className="text-xs text-gray-900 font-semibold">
            See All
          </button>
        </div>

        {users.length === 0 && (
          <p className="text-gray-400 text-xs">No suggestions available.</p>
        )}

        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">
                  {user.username}
                </p>
                {user.mutuals && user.mutuals.length > 0 && (
                  <p className="text-gray-500 text-xs">
                    Followed by {user.mutuals.join(", ")}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleFollow(user)}
              className="text-blue-500 text-xs font-semibold py-1 px-2 rounded hover:bg-blue-50 transition"
            >
              Follow
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-xs text-gray-400 space-y-1">
        <div className="flex flex-wrap gap-x-1">
          <a href="#" className="hover:underline">
            About
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Help
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Press
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            API
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Jobs
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Locations
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Language
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Meta Verified
          </a>
        </div>
        <p>© 2026 Instagram from Meta</p>
      </div>
    </aside>
  );
};

export default SuggestedUserSidebar;
