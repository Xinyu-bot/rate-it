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

// Generic request function
const makeRequest = async (method, url, data = null, params = null) => {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
    });
    return response;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
    throw error;
  }
};

// API endpoints
const request = {
  // Generic methods
  // get: (url, params) => makeRequest("get", url, null, params),
  // post: (url, data) => makeRequest("post", url, data),
  // put: (url, data) => makeRequest("put", url, data),
  // delete: (url) => makeRequest("delete", url),

  // Categories
  getCategories: () => makeRequest("get", "/categories"),

  // Entities
  getEntities: (params) => makeRequest("get", "/entities", null, params),
  getEntity: (id) => makeRequest("get", `/entity/${id}`),
  createEntity: (data) => makeRequest("post", "/entity", data),
  updateEntity: (id, data) => makeRequest("put", `/entity/${id}`, data),
  deleteEntity: (id) => makeRequest("delete", `/entity/${id}`),

  // Entity Suggestions
  getEntitySuggestions: () => makeRequest("get", "/entity_suggestions"),
  createEntitySuggestion: (data) =>
    makeRequest("post", "/entity_suggestions", data),
  getEntitySuggestion: (id) => makeRequest("get", `/entity_suggestions/${id}`),
  updateEntitySuggestion: (id, data) =>
    makeRequest("put", `/entity_suggestions/${id}`, data),
  deleteEntitySuggestion: (id) =>
    makeRequest("delete", `/entity_suggestions/${id}`),

  // User
  getCurrentUser: () => makeRequest("get", "/user/me"),
  updateCurrentUser: (data) => makeRequest("put", "/user/me", data),
  getUserProfile: (id) => makeRequest("get", `/user/${id}/profile`),

  // Comment Threads
  getCommentThreads: (params) =>
    makeRequest("get", "/comment_threads", null, params),
  createCommentThread: (data) => makeRequest("post", "/comment_threads", data),
  getCommentThread: (id) => makeRequest("get", `/comment_threads/${id}`),
  updateCommentThread: (id, data) =>
    makeRequest("put", `/comment_threads/${id}`, data),
  deleteCommentThread: (id) => makeRequest("delete", `/comment_threads/${id}`),

  // Comment Replies
  getCommentReplies: (threadId) =>
    makeRequest("get", `/comment_threads/${threadId}/replies`),
  createCommentReply: (threadId, data) =>
    makeRequest("post", `/comment_threads/${threadId}/replies`, data),
  getCommentReply: (id) => makeRequest("get", `/comment_replies/${id}`),
  updateCommentReply: (id, data) =>
    makeRequest("put", `/comment_replies/${id}`, data),
  deleteCommentReply: (id) => makeRequest("delete", `/comment_replies/${id}`),

  // Votes
  voteCommentThread: (threadId, data) =>
    makeRequest("post", `/votes/comment_thread/${threadId}`, data),
  removeVoteFromCommentThread: (threadId) =>
    makeRequest("delete", `/votes/comment_thread/${threadId}`),

  // User Activity
  getUserThreads: (userId) => makeRequest("get", `/users/${userId}/threads`),
  getUserReplies: (userId) => makeRequest("get", `/users/${userId}/replies`),
  getUserVotes: (userId, type) =>
    makeRequest("get", `/users/${userId}/votes?type=${type}`),

  // My Activity
  getMyThreads: () => makeRequest("get", "/user/me/threads"),
  getMyReplies: () => makeRequest("get", "/user/me/replies"),
  getMyVotes: (type) => makeRequest("get", `/user/me/votes?type=${type}`),
};

export { request };
