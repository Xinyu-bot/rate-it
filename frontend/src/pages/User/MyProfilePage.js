import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { request } from "../../utils/request";
import "./MyProfilePage.scss";

const MyProfilePage = () => {
  const { isAuthenticated, authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("threads");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);
  const [upvotes, setUpvotes] = useState([]);
  const [downvotes, setDownvotes] = useState([]);
  const navigate = useNavigate();

  const fetchActivityData = useCallback(
    async (tab) => {
      if (!profile) return;

      setActivityLoading(true);

      try {
        let response;
        switch (tab) {
          case "threads":
            response = await request.getMyThreads();
            break;
          case "replies":
            response = await request.getMyReplies();
            break;
          case "upvotes":
            response = await request.getMyVotes("upvote");
            break;
          case "downvotes":
            response = await request.getMyVotes("downvote");
            break;
          default:
            response = request.getMyThreads();
        }

        let data;
        if (response.data?.code === 0) {
          data = response.data.data;
        } else {
          console.error(`Failed to fetch ${tab}:`, response.data?.message);
        }

        switch (tab) {
          case "threads":
            setThreads(data.threads);
            break;
          case "replies":
            setReplies(data.replies);
            break;
          case "upvotes":
            setUpvotes(data.upvotes);
            break;
          case "downvotes":
            setDownvotes(data.downvotes);
            break;
          default:
            break;
        }
      } catch (err) {
        console.error(`Error fetching ${tab}:`, err);
      } finally {
        setActivityLoading(false);
      }
    },
    [profile]
  );

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/user/me",
          message: "Please log in to view your profile",
        },
      });
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await request.getCurrentUser();
        if (response.data?.code === 0) {
          setProfile(response.data.data);
        } else {
          setError(response.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("An error occurred while fetching your profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (!profile) return;

    fetchActivityData(activeTab);
  }, [profile, activeTab, fetchActivityData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="my-profile-page loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-profile-page error">
        <h2>Error</h2>
        <p>{error}</p>
        {!isAuthenticated && (
          <button onClick={() => (window.location.href = "/login")}>
            Go to Login
          </button>
        )}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="my-profile-page not-found">
        <h2>Profile Not Found</h2>
        <p>We couldn't find your profile information.</p>
      </div>
    );
  }

  return (
    <div className="my-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={profile.profile_picture || "/images/default-avatar.png"}
            alt={`${profile.username}'s avatar`}
          />
        </div>
        <div className="profile-info">
          <h1 className="clickable">{profile.username}</h1>
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
            <div className="meta-item">
              <span className="meta-label">Points</span>
              <span className="meta-value">{profile.user_point_balance}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Role</span>
              <span className="meta-value">{profile.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "threads" ? "active" : ""}`}
            onClick={() => handleTabChange("threads")}
          >
            My Threads
          </button>
          <button
            className={`tab-button ${activeTab === "replies" ? "active" : ""}`}
            onClick={() => handleTabChange("replies")}
          >
            My Replies
          </button>
          <button
            className={`tab-button ${activeTab === "upvotes" ? "active" : ""}`}
            onClick={() => handleTabChange("upvotes")}
          >
            My Upvotes
          </button>
          <button
            className={`tab-button ${
              activeTab === "downvotes" ? "active" : ""
            }`}
            onClick={() => handleTabChange("downvotes")}
          >
            My Downvotes
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
                      <p>You haven't created any threads yet.</p>
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
                              Thread #{reply.comment_thread_id}
                            </Link>
                          </span>
                          <span>{formatDate(reply.created_at)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>You haven't replied to any threads yet.</p>
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
                            Thread at {vote.comment_thread_id}
                          </Link>
                        </div>
                        <div className="vote-date">
                          {formatDate(vote.created_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>You haven't upvoted any threads yet.</p>
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
                            Thread at {vote.comment_thread_id}
                          </Link>
                        </div>
                        <div className="vote-date">
                          {formatDate(vote.created_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>You haven't downvoted any threads yet.</p>
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

export default MyProfilePage;
