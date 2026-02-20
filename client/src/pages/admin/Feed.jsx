import AdminLayout from "../../layouts/AdminLayout";
import Feedposts from "../../components/Feedposts";
import Stories from "../../components/Stories";

const Feed = () => {
  return (
    <AdminLayout showSuggestions={true}>
      <Stories />

      <div className="space-y-4">
        <Feedposts />
      </div>
    </AdminLayout>
  );
};

export default Feed;
