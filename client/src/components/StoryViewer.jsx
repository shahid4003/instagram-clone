import { useState, useEffect } from "react";

const StoryViewer = ({ story, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onClose();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5 second auto-close

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 text-white text-2xl hover:opacity-70 transition"
      >
        ✕
      </button>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-4">
        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Story content */}
      <div className="relative w-full max-w-md aspect-[9/16]">
        {story.video ? (
          <video
            src={story.video}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={story.image}
            alt="story"
            className="w-full h-full object-cover"
          />
        )}

        {/* User info overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4">
          <div className="flex items-center gap-3">
            <img
              src={story.user.img}
              alt={story.user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">
                {story.user.name || story.user.username}
              </p>
              <p className="text-white/70 text-xs">@{story.user.username}</p>
            </div>
          </div>
        </div>

        {/* Viewers list (if any) */}
        {story.views && story.views.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="text-white text-xs font-semibold mb-2">
              {story.views.length} {story.views.length === 1 ? "view" : "views"}
            </div>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {story.views.map((view) => (
                <div
                  key={view.user.id}
                  className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1"
                  title={view.user.name || view.user.username}
                >
                  <img
                    src={view.user.img}
                    alt={view.user.username}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-xs text-white truncate max-w-[60px]">
                    {view.user.name || view.user.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click to close hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-xs">
        Click anywhere to close
      </div>
    </div>
  );
};

export default StoryViewer;
