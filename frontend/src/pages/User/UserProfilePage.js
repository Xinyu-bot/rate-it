import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { request } from "../../utils/request";
import "./UserProfilePage.scss";

const UserProfilePage = () => {
  const { userId } = useParams();
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
      setError("You must be logged in to view this page");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await request.getUserProfile(userId);

        if (response.data?.code === 0) {
          setProfile(response.data.data);
        } else {
          setError(response.message || "Failed to fetch user profile");
        }
      } catch (err) {
        setError("An error occurred while fetching the user profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!profile) return;

      setActivityLoading(true);

      try {
        let response;
        switch (activeTab) {
          case "threads":
            response = await request.getUserThreads(userId);
            break;
          case "replies":
            response = await request.getUserReplies(userId);
            break;
          case "upvotes":
            response = await request.getUserVotes(userId, "upvote");
            break;
          case "downvotes":
            response = await request.getUserVotes(userId, "downvote");
            break;
          default:
            response = await request.getUserProfile(userId);
        }

        if (response.data?.code === 0) {
          const data = response.data.data;

          switch (activeTab) {
            case "threads":
              setThreads(data.threads || []);
              break;
            case "replies":
              setReplies(data.replies || []);
              break;
            case "upvotes":
              setUpvotes(data.upvotes || []);
              break;
            case "downvotes":
              setDownvotes(data.downvotes || []);
              break;
            default:
              break;
          }
        } else {
          console.error(`Failed to fetch ${activeTab}:`, response.message);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
      } finally {
        setActivityLoading(false);
      }
    };

    if (profile) {
      fetchActivityData();
    }
  }, [profile, activeTab, userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const navigateToUserProfile = () => {
    // This is already the user profile page, but we'll keep the function
    // for consistency with other components
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
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-profile-page not-found">
        <h2>Profile Not Found</h2>
        <p>We couldn't find this user's profile information.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={profile.avatar_url || "/images/default-avatar.png"}
            alt={`${profile.username}'s avatar`}
            onClick={navigateToUserProfile}
          />
        </div>
        <div className="profile-info">
          <h1 className="clickable" onClick={navigateToUserProfile}>
            {profile.username}
          </h1>
          <div className="profile-meta">
            <div className="meta-item">
              <span className="meta-label">Member Since</span>
              <span className="meta-value">
                {formatDate(profile.created_at)}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Level</span>
              <span className="meta-value">{profile.level}</span>
            </div>
            {/* Note: We don't show points for privacy reasons */}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="tabs-header">
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
            className={`tab-button ${activeTab === "votes" ? "active" : ""}`}
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

        <div className="tab-content">
          {activityLoading ? (
            <div className="activity-loading">
              <div className="loading-spinner small"></div>
              <p>Loading {activeTab}...</p>
            </div>
          ) : (
            <>
              {activeTab === "threads" && (
                <div className="threads-list">
                  {threads.length > 0 ? (
                    threads.map((thread) => (
                      <div key={thread.id} className="thread-item">
                        <div className="thread-header">
                          <h3>
                            <Link to={`/entity/${thread.entity_id}`}>
                              {thread.title ||
                                `Thread #${thread.comment_thread_id}`}
                            </Link>
                          </h3>
                          {thread.rating && (
                            <div className="thread-rating">
                              Rating:{" "}
                              <span className="rating-value">
                                {thread.rating}/5
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="thread-content">
                          <p>{thread.content}</p>
                        </div>
                        <div className="thread-footer">
                          <span>{formatDate(thread.created_at)}</span>
                          <div className="thread-stats">
                            <span className="upvotes">
                              {thread.upvotes_count || 0} upvotes
                            </span>
                            <span className="downvotes">
                              {thread.downvotes_count || 0} downvotes
                            </span>
                            <span className="replies">
                              {thread.replies_count || 0} replies
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>This user hasn't created any threads yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "replies" && (
                <div className="replies-list">
                  {replies.length > 0 ? (
                    replies.map((reply) => (
                      <div key={reply.id} className="reply-item">
                        <div className="reply-content">
                          <p>{reply.content}</p>
                        </div>
                        <div className="reply-footer">
                          <span>
                            In response to{" "}
                            <Link to={`/entity/${reply.entity_id}`}>
                              Thread #{reply.thread_id}
                            </Link>
                          </span>
                          <span>{formatDate(reply.created_at)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>This user hasn't replied to any threads yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "upvotes" && (
                <div className="votes-list">
                  {upvotes.length > 0 ? (
                    upvotes.map((vote) => (
                      <div key={vote.id} className="vote-item">
                        <div className="vote-type">
                          <span className={(vote.type = "upvote")}>
                            {(vote.type = "Upvoted")}
                          </span>
                        </div>
                        <div className="vote-thread-id">
                          <Link to={`/entity/${vote.entity_id}`}>
                            Thread #{vote.thread_id}
                          </Link>
                        </div>
                        <div className="vote-date">
                          {formatDate(vote.created_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>This user hasn't voted on any threads yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "downvotes" && (
                <div className="votes-list">
                  {downvotes.length > 0 ? (
                    downvotes.map((vote) => (
                      <div key={vote.id} className="vote-item">
                        <div className="vote-type">
                          <span className={(vote.type = "downvote")}>
                            {(vote.type = "Downvoted")}
                          </span>
                        </div>
                        <div className="vote-thread-id">
                          <Link to={`/entity/${vote.entity_id}`}>
                            Thread #{vote.thread_id}
                          </Link>
                        </div>
                        <div className="vote-date">
                          {formatDate(vote.created_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>This user hasn't voted on any threads yet.</p>
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
