import "./App.css";
import Profile from "./pages/admin/Profile";
import Signup from "./pages/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import PostForm from "./pages/admin/PostForm";
import Feed from "./pages/admin/Feed";
import Login from "./pages/Login";
import ChatBoard from "./pages/admin/ChatBoard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateStory from "./pages/admin/CreateStory";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/new"
          element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:slug"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <ChatBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/story/new"
          element={
            <ProtectedRoute>
              <CreateStory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
