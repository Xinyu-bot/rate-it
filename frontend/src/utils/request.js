import axios from "axios";

// Create an axios instance with base URL from environment variable
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include JWT token in requests
api.interceptors.request.use(
  (config) => {
    // Try to get the session from localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
const request = {
  // Categories
  getCategories: () => api.get("/categories"),

  // Entities
  getEntities: (params) => api.get("/entities", { params }),
  getEntity: (id) => api.get(`/entities/${id}`),
  createEntity: (data) => api.post("/entities", data),
  updateEntity: (id, data) => api.put(`/entities/${id}`, data),
  deleteEntity: (id) => api.delete(`/entities/${id}`),

  // Entity Suggestions
  getEntitySuggestions: () => api.get("/entity_suggestions"),
  createEntitySuggestion: (data) => api.post("/entity_suggestions", data),
  getEntitySuggestion: (id) => api.get(`/entity_suggestions/${id}`),
  updateEntitySuggestion: (id, data) =>
    api.put(`/entity_suggestions/${id}`, data),
  deleteEntitySuggestion: (id) => api.delete(`/entity_suggestions/${id}`),

  // User
  getCurrentUser: () => api.get("/user/me"),
  updateCurrentUser: (data) => api.put("/user/me", data),
  getUserProfile: (id) => api.get(`/users/${id}/profile`),

  // Comment Threads
  getCommentThreads: (params) => api.get("/comment_threads", { params }),
  createCommentThread: (data) => api.post("/comment_threads", data),
  getCommentThread: (id) => api.get(`/comment_threads/${id}`),
  updateCommentThread: (id, data) => api.put(`/comment_threads/${id}`, data),
  deleteCommentThread: (id) => api.delete(`/comment_threads/${id}`),

  // Comment Replies
  getCommentReplies: (threadId) =>
    api.get(`/comment_threads/${threadId}/replies`),
  getCommentReply: (id) => api.get(`/comment_replies/${id}`),
  updateCommentReply: (id, data) => api.put(`/comment_replies/${id}`, data),
  deleteCommentReply: (id) => api.delete(`/comment_replies/${id}`),

  // Votes
  voteCommentThread: (threadId, data) =>
    api.post(`/votes/comment_thread/${threadId}`, data),
  removeVoteFromCommentThread: (threadId) =>
    api.delete(`/votes/comment_thread/${threadId}`),
};

export default request;
