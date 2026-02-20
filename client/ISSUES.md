# Codebase Issues Report

## High Priority Issues

### 1. Duplicate Stories Component
- **Location**: `src/components/Stories.jsx` and `src/features/stories/components/Stories.jsx`
- **Issue**: Two Stories components exist. The one in `features/stories` is unused and references undefined `sampleStories`

### 2. Missing Error Handling
- **Login.jsx:32** - `result` referenced in catch block but undefined if fetch fails
- **SignUp.jsx:31** - Same issue as Login
- **Feedposts.jsx:10** - No error handling for user fetch

### 3. Missing Credentials in Fetch Calls
- **Stories.jsx:20,57** - `fetch("/api/story/...")` missing `credentials: "include"`
- **PostCard.jsx:15,26** - Like/unlike requests missing credentials

### 4. Null Safety Issues
- **PostCard.jsx:9** - `post.likes?.some()` and `user.id` could be undefined
- **Profile.jsx:26** - No null check for `data.user`
- **Feedposts.jsx:57,61** - `user.user` could be undefined

## Medium Priority Issues

### 5. Inconsistent API Calls
- Mix of native `fetch` and `axios` throughout codebase
- Should standardize on one approach

### 6. ProtectedRoute Inefficiency
- **ProtectedRoute.jsx** - Refetches user on every protected route render
- Should cache authentication state

### 7. Unused Imports
- **Profile.jsx** - Imports icons but some may be unused
- **CreateStory.jsx** - React import unused

### 8. Debug Console.logs Left in Code
- `Profile.jsx:38`
- `ProtectedRoute.jsx:16`
- `Login.jsx:28`

## Low Priority Issues

### 9. No TypeScript
- Project has TypeScript installed but all files use `.jsx` extension
- Missing type safety

### 10. Hardcoded Image Placeholders
- **PostCard.jsx:47,180** - Hardcoded Unsplash URLs should be configurable

### 11. Accessibility
- Some links use `href="#"` (Profile.jsx:123,169)
- Should use proper navigation

### 12. Missing Loading States
- Some components show "Loading..." text instead of proper spinners
- Inconsistent with other loading states

### 13. useFetch Hook Not Used Properly
- **Feedposts.jsx:10** - Uses custom hook but also mixes with React Query
- Hook lacks axios consistency with rest of app
