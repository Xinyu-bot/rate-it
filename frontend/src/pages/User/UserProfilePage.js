import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { request } from "../../utils/request";
import "./UserProfilePage.scss";

const UserProfilePage = () => {
  // Extract the full UUID from the URL path directly
  const location = useLocation();
  const userId = location.pathname.split("/user/")[1];

  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("threads");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);
  const [upvotes, setUpvotes] = useState([]);
  const [downvotes, setDownvotes] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/user/${userId}`,
          message: "Please log in to view user profiles",
        },
      });
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        if (!userId) {
          throw new Error("Invalid user ID");
        }

        const response = await request.getUserProfile(userId);

        if (response.data?.code === 0) {
          setProfile(response.data.data);
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!isAuthenticated || !userId || !profile) return;

      setActivityLoading(true);
      let response;

      try {
        switch (activeTab) {
          case "threads":
            response = await request.getUserThreads(userId);
            if (response.data?.code === 0) {
              setThreads(response.data.data.comment_threads || []);
            }
            break;
          case "replies":
            response = await request.getUserReplies(userId);
            if (response.data?.code === 0) {
              setReplies(response.data.data.comment_replies || []);
            }
            break;
          case "upvotes":
            response = await request.getUserVotes(userId, "upvote");
            if (response.data?.code === 0) {
              setUpvotes(response.data.data.votes || []);
            }
            break;
          case "downvotes":
            response = await request.getUserVotes(userId, "downvote");
            if (response.data?.code === 0) {
              setDownvotes(response.data.data.votes || []);
            }
            break;
          default:
            response = await request.getUserProfile(userId);
            break;
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivityData();
  }, [activeTab, userId, isAuthenticated, profile]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const navigateToUserProfile = () => {
    if (profile && profile.id) {
      navigate(`/user/${profile.id}`);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="user-profile-page loading">
        <div className="loading-spinner"></div>
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-profile-page not-found">
        <h2>User Not Found</h2>
        <p>The user you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={profile.profile_picture || "/images/default-avatar.png"}
            alt={`${profile.username}'s avatar`}
          />
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <div className="profile-meta">
            <div className="profile-level">
              <span className="label">Level:</span>
              <span className="value">{profile.level || 1}</span>
            </div>
            <div className="profile-member-since">
              <span className="label">Member since:</span>
              <span className="value">{formatDate(profile.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-activity">
        <div className="activity-tabs">
          <button
            className={`tab-button ${activeTab === "threads" ? "active" : ""}`}
            onClick={() => handleTabChange("threads")}
          >
            Threads
          </button>
          <button
            className={`tab-button ${activeTab === "replies" ? "active" : ""}`}
            onClick={() => handleTabChange("replies")}
          >
            Replies
          </button>
          <button
            className={`tab-button ${activeTab === "upvotes" ? "active" : ""}`}
            onClick={() => handleTabChange("upvotes")}
          >
            Upvotes
          </button>
          <button
            className={`tab-button ${
              activeTab === "downvotes" ? "active" : ""
            }`}
            onClick={() => handleTabChange("downvotes")}
          >
            Downvotes
          </button>
        </div>

        <div className="activity-content">
          {activityLoading ? (
            <div className="activity-loading">
              <div className="loading-spinner"></div>
              <p>Loading activity...</p>
            </div>
          ) : (
            <>
              {activeTab === "threads" && (
                <div className="threads-list">
                  <h2>Comment Threads</h2>
                  {threads.length > 0 ? (
                    <div className="threads">
                      {threads.map((thread) => (
                        <div key={thread.id} className="thread-item">
                          <div className="thread-header">
                            <Link
                              to={`/entity/${thread.entity_id}`}
                              className="entity-link"
                            >
                              {thread.entity_name || "Unknown Entity"}
                            </Link>
                            <span className="thread-date">
                              {formatDate(thread.created_at)}
                            </span>
                          </div>
                          <div className="thread-content">
                            <p>{thread.content}</p>
                          </div>
                          <div className="thread-stats">
                            <span className="upvotes">
                              👍 {thread.upvote_count || 0}
                            </span>
                            <span className="downvotes">
                              👎 {thread.downvote_count || 0}
                            </span>
                            <span className="replies">
                              💬 {thread.replies_count || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-activity">
                      <p>No comment threads yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "replies" && (
                <div className="replies-list">
                  <h2>Comment Replies</h2>
                  {replies.length > 0 ? (
                    <div className="replies">
                      {replies.map((reply) => (
                        <div key={reply.id} className="reply-item">
                          <div className="reply-header">
                            <Link
                              to={`/entity/${reply.entity_id}`}
                              className="entity-link"
                            >
                              {reply.entity_name || "Unknown Entity"}
                            </Link>
                            <span className="reply-date">
                              {formatDate(reply.created_at)}
                            </span>
                          </div>
                          <div className="reply-content">
                            <p>{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-activity">
                      <p>No replies yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "upvotes" && (
                <div className="votes-list">
                  <h2>Upvoted Comments</h2>
                  {upvotes.length > 0 ? (
                    <div className="votes">
                      {upvotes.map((vote) => (
                        <div key={vote.id} className="vote-item">
                          <div className="vote-header">
                            <Link
                              to={`/entity/${vote.entity_id}`}
                              className="entity-link"
                            >
                              {vote.entity_name || "Unknown Entity"}
                            </Link>
                            <span className="vote-date">
                              {formatDate(vote.created_at)}
                            </span>
                          </div>
                          <div className="vote-content">
                            <p>{vote.comment_content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-activity">
                      <p>No upvotes yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "downvotes" && (
                <div className="votes-list">
                  <h2>Downvoted Comments</h2>
                  {downvotes.length > 0 ? (
                    <div className="votes">
                      {downvotes.map((vote) => (
                        <div key={vote.id} className="vote-item">
                          <div className="vote-header">
                            <Link
                              to={`/entity/${vote.entity_id}`}
                              className="entity-link"
                            >
                              {vote.entity_name || "Unknown Entity"}
                            </Link>
                            <span className="vote-date">
                              {formatDate(vote.created_at)}
                            </span>
                          </div>
                          <div className="vote-content">
                            <p>{vote.comment_content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-activity">
                      <p>No downvotes yet.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
