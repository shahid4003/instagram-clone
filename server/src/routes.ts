import express, { Router } from "express";
import { login, register, logout } from "./controllers/authController.js";
import { getProfile, getUserById, updateUser, getUserByUsername } from "./controllers/userController.js";
import { followUser, getFollowing, getFollowingByUserId, getFollowers, getFollowersByUserId, unfollowUser } from "./controllers/followerController.js";
import { addMedia, createPost, deletePost, getAllPosts, getPostById, updatePost } from "./controllers/postController.js";
import { likeController, unLikeController, getPostLikes } from "./controllers/likesController.js";
import { deleteComment, getComments, newComment } from "./controllers/commentsController.js";
import { createStory, deleteStory, getStories, markStoryAsViewed, updateStoryMedia } from "./controllers/storyController.js";
import { getFeed } from "./controllers/feedController.js";
import { uploadToS3, getSignedUrl } from "./controllers/s3Controller.js";
import { getSuggestedUsers } from "./controllers/recommendationController.js";
import { getUserMessages } from "./controllers/mesageController.js";

const router: Router = express.Router();

router.post("/auth/signup", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

router.get("/user/me", getUserById);
router.get("/user/profile", getProfile);
router.get("/user/suggestions", getSuggestedUsers);
router.get("/user/messages", getUserMessages);
router.get("/user/:username", getUserByUsername);
router.put("/user/me", updateUser);

router.post("/follow/follow-user", followUser);
router.delete("/follow/unfollow-user", unfollowUser);
router.get("/follow/following", getFollowing);
router.get("/follow/following/:userId", getFollowingByUserId);
router.get("/follow/followers", getFollowers);
router.get("/follow/followers/:userId", getFollowersByUserId);

router.post("/post/new", createPost);
router.get("/post", getAllPosts);
router.get("/post/:id", getPostById);
router.put("/post/:id", updatePost);
router.delete("/post/:id", deletePost);
router.put("/post/:postId/media", addMedia);

router.post("/like/:postId", likeController);
router.delete("/unlike/:postId", unLikeController);
router.get("/like/:postId", getPostLikes);

router.post("/comment", newComment);
router.get("/comment/:postId", getComments);
router.delete("/comment/:commentId", deleteComment);

router.post("/story/new", createStory);
router.get("/story", getStories);
router.delete("/story/:storyId", deleteStory);
router.post("/story/:storyId/view", markStoryAsViewed);
router.put("/story/:storyId/media", updateStoryMedia);

router.get("/feed", getFeed);

router.post("/s3/upload", uploadToS3);
router.get("/s3/url/", getSignedUrl);

export default router;
