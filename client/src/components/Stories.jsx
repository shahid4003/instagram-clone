import { useEffect, useMemo, useState } from "react";
import StoryForm from "./StoryForm";
import StoryViewer from "./StoryViewer";

const Stories = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [showViewersList, setShowViewersList] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [selectedStoryForViewers, setSelectedStoryForViewers] = useState(null);

  const displayStories = useMemo(() => {
    const grouped = new Map();

    stories.forEach((story) => {
      const userId = story?.user?.id || story?.id;
      if (!userId) return;

      if (!grouped.has(userId)) {
        grouped.set(userId, {
          ...story,
          viewCount: story.isSelf ? story.viewCount || 0 : 0,
          viewers: story.isSelf ? story.viewers || [] : [],
          isViewed: story.isViewed ?? false,
          _stories: [story],
        });
        return;
      }

      const existing = grouped.get(userId);
      existing._stories.push(story);
      existing.isViewed = Boolean(existing.isViewed && story.isViewed);

      if (existing.isSelf) {
        const combinedViewers = new Map(
          (existing.viewers || []).map((viewer) => [viewer.id, viewer])
        );
        (story.viewers || []).forEach((viewer) => {
          combinedViewers.set(viewer.id, viewer);
        });
        existing.viewers = Array.from(combinedViewers.values());
        existing.viewCount = existing.viewers.length;
      }
    });

    return Array.from(grouped.values());
  }, [stories]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/story/", {
        credentials: "include",
      });
      const data = await response.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const handleNewStory = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    // Refresh stories after creating new one
    fetchStories();
  };

  const handleStoryClick = (story) => {
    // Allow viewing own stories too!
    setSelectedStory(story);
    setShowStoryViewer(true);

    // Mark as viewed (will be ignored for own stories on backend)
    markStoryAsViewed(story.id);
  };

  const handleViewCountClick = (e, story) => {
    e.stopPropagation();
    // Open viewers modal for this story
    setSelectedStoryForViewers(story);
    setViewers(story.viewers || []);
    setShowViewersList(true);
  };

  const markStoryAsViewed = async (storyId) => {
    try {
      await fetch(`/api/story/${storyId}/view`, {
        method: "POST",
        credentials: "include",
      });
      // Refresh stories to update view status
      fetchStories();
    } catch (error) {
      console.error("Error marking story as viewed:", error);
    }
  };

  const handleCloseViewer = () => {
    setShowStoryViewer(false);
    setSelectedStory(null);
  };

  const handleCloseViewersList = () => {
    setShowViewersList(false);
    setSelectedStoryForViewers(null);
    setViewers([]);
  };

  return (
    <>
      <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar px-4 pt-4 bg-white border-b border-gray-100">
        {/* Add Story Button */}
        <div className="relative flex-shrink-0">
          <div className="h-[66px] w-[66px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 p-0.5">
            <div className="h-full w-full rounded-full bg-white p-[2px]">
              <div
                className="h-full w-full rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={handleNewStory}
              >
                <svg
                  className="w-7 h-7 text-blue-500"
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
            </div>
          </div>
          <div
            onClick={handleNewStory}
            className="absolute bottom-0 right-0 h-6 w-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <span className="text-xs text-gray-900 mt-2 max-w-[70px] truncate text-center leading-none">
            Add Story
          </span>
        </div>

        {/* All Stories - Your stories and Others */}
        {displayStories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            onClick={() => handleStoryClick(story)}
          >
            {/* Story Ring */}
            <div className="relative">
              {story.isSelf ? (
                // Your own story - gray border
                <div className="h-[66px] w-[66px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 p-0.5">
                  <div className="h-full w-full rounded-full bg-white p-[2px]">
                    <img
                      src={story.user.img}
                      alt={story.user.username}
                      className="h-full w-full rounded-full object-cover border-2 border-gray-300"
                    />
                  </div>
                </div>
              ) : (
                // Other user story with gradient if unviewed
                <div
                  className={`h-[66px] w-[66px] rounded-full p-0.5 transition-all ${
                    !story.isViewed
                      ? "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#dc2743]"
                      : "bg-gray-300"
                  }`}
                >
                  <div className="h-full w-full rounded-full bg-white p-[2px]">
                    <img
                      src={story.user.img}
                      alt={story.user.username}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Username */}
            <span className="text-xs text-gray-900 mt-2 max-w-[70px] truncate text-center leading-none">
              {story.isSelf ? "Your story" : story.user.username}
            </span>

            {/* View count for self stories - CLICKABLE */}
            {story.isSelf && story.viewCount > 0 && (
              <button
                onClick={(e) => handleViewCountClick(e, story)}
                className="text-xs text-blue-500 mt-0.5 font-semibold hover:underline cursor-pointer"
              >
                {story.viewCount} {story.viewCount === 1 ? "view" : "views"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Story Form Modal */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={handleCloseDialog}
          />
          <div className="relative z-10">
            <StoryForm onClose={handleCloseDialog} />
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {showStoryViewer && selectedStory && (
        <StoryViewer story={selectedStory} onClose={handleCloseViewer} />
      )}

      {/* Viewers List Modal */}
      {showViewersList && selectedStoryForViewers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={handleCloseViewersList}
          />
          <div className="relative z-10 bg-white rounded-lg shadow-lg max-w-md w-full p-4">
            <h3 className="text-lg font-semibold mb-4">
              Viewers of{" "}
              <span className="text-blue-500">
                {selectedStoryForViewers.user.username}'s story
              </span>
            </h3>
            <div className="max-h-[300px] overflow-y-auto">
              {viewers.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No viewers yet.
                </p>
              ) : (
                viewers.map((viewer) => (
                  <div
                    key={viewer.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={viewer.img}
                      alt={viewer.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {viewer.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {viewer.viewedAt
                          ? new Date(viewer.viewedAt).toLocaleString()
                          : "Viewed not yet"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleCloseViewersList}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
