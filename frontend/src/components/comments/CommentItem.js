import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { request } from "../../utils/request";
import StarRating from "./StarRating";
import ReplyForm from "./ReplyForm";
import "./CommentItem.scss";

const CommentItem = ({ comment, onVoteSuccess, level = 0, entityId }) => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState(null); // 'upvote', 'downvote', or null
  const [voteLoading, setVoteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [repliesError, setRepliesError] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setUserLoading(true);
        const response = await request(
          "/users/" + comment.user_id + "/profile"
        );

        if (response.data?.code === 0) {
          setUser(response.data.data.user); // FIXME: see if this is the correct way
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setUserLoading(false);
      }
    };

    if (comment.user_id) {
      fetchUserDetails();
    }
  }, [comment.user_id]);

  // Check if the current user has voted on this comment
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (!isAuthenticated || !userId) return;

      try {
        // This would ideally be an API call to check the user's vote status
        // For now, we'll simulate it based on the comment data

        // In a real implementation, you would have an API endpoint to get the user's vote status
        // const response = await request.getUserVoteStatus(comment.comment_thread_id);
        // setVoteStatus(response.data.vote_type);

        // For now, we'll just use a placeholder
        setVoteStatus(null);
      } catch (err) {
        console.error("Error checking vote status:", err);
      }
    };

    checkVoteStatus();
  }, [comment.comment_thread_id, isAuthenticated, userId]);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      setError("You must be logged in to vote");
      return;
    }

    setVoteLoading(true);
    setError(null);

    try {
      if (voteStatus === voteType) {
        // Remove vote if clicking the same button
        await request.removeVoteFromCommentThread(comment.comment_thread_id);
        setVoteStatus(null);
      } else {
        // Add or change vote
        await request.voteCommentThread(comment.comment_thread_id, {
          vote_type: voteType,
        });
        setVoteStatus(voteType);
      }

      // Notify parent component to refresh comments
      if (onVoteSuccess) {
        onVoteSuccess();
      }
    } catch (err) {
      console.error("Error voting:", err);
      setError("Failed to register your vote. Please try again.");
    } finally {
      setVoteLoading(false);
    }
  };

  const fetchReplies = async () => {
    if (repliesLoading) return;

    setRepliesLoading(true);
    setRepliesError(null);

    try {
      const response = await request.getCommentReplies(
        comment.comment_thread_id
      );

      if (response.data?.code === 0) {
        const data = response.data.data;
        setReplies(data.comment_replies || []);
      } else {
        setRepliesError("Failed to load replies");
      }
    } catch (err) {
      console.error("Error fetching replies:", err);
      setRepliesError("An error occurred while loading replies");
    } finally {
      setRepliesLoading(false);
    }
  };

  const toggleReplies = () => {
    if (!showReplies && comment.replies_count > 0 && replies.length === 0) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      setError("You must be logged in to reply");
      return;
    }
    setShowReplyForm(!showReplyForm);
  };

  const handleReplySubmitted = () => {
    // Refresh replies
    fetchReplies();
    // Show replies if they were hidden
    setShowReplies(true);
    // Hide the reply form
    setShowReplyForm(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className={`comment-item ${level > 0 ? "reply" : ""}`}
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div className="comment-header">
        <div className="user-info">
          {userLoading ? (
            <span className="username">Loading user...</span>
          ) : (
            <>
              <img
                src={user?.profile_picture || "/images/default-avatar.png"}
                alt={user?.username || "User"}
                className="avatar"
              />
              <span className="username">{user?.username || "Anonymous"}</span>
            </>
          )}
        </div>
        <div className="comment-date">{formatDate(comment.created_at)}</div>
      </div>

      {comment.rating > 0 && (
        <div className="comment-rating">
          <StarRating rating={comment.rating} readOnly />
        </div>
      )}

      <div className="comment-content">
        <p>{comment.content}</p>
      </div>

      <div className="comment-actions">
        <div className="vote-buttons">
          <button
            className={`vote-button upvote ${
              voteStatus === "upvote" ? "active" : ""
            }`}
            onClick={() => handleVote("upvote")}
            disabled={voteLoading}
            aria-label="Upvote"
          >
            <span className="vote-icon">👍</span>
            <span className="vote-count">{comment.upvote_count || 0}</span>
          </button>

          <button
            className={`vote-button downvote ${
              voteStatus === "downvote" ? "active" : ""
            }`}
            onClick={() => handleVote("downvote")}
            disabled={voteLoading}
            aria-label="Downvote"
          >
            <span className="vote-icon">👎</span>
            <span className="vote-count">{comment.downvote_count || 0}</span>
          </button>

          <button
            className="reply-button"
            onClick={handleReplyClick}
            aria-label="Reply"
          >
            <span className="reply-icon">↩️</span>
            <span>Reply</span>
          </button>

          {comment.replies_count > 0 && (
            <button
              className={`replies-toggle ${showReplies ? "active" : ""}`}
              onClick={toggleReplies}
              aria-label={showReplies ? "Hide replies" : "Show replies"}
            >
              <span className="replies-icon">{showReplies ? "▼" : "▶"}</span>
              <span className="replies-count">
                {comment.replies_count}{" "}
                {comment.replies_count === 1 ? "reply" : "replies"}
              </span>
            </button>
          )}
        </div>

        {error && <div className="vote-error">{error}</div>}
      </div>

      {showReplyForm && (
        <ReplyForm
          threadId={comment.comment_thread_id}
          entityId={entityId || comment.entity_id}
          onReplySubmitted={handleReplySubmitted}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {showReplies && (
        <div className="replies-container">
          {repliesLoading ? (
            <div className="replies-loading">
              <div className="loading-spinner small"></div>
              <p>Loading replies...</p>
            </div>
          ) : repliesError ? (
            <div className="replies-error">
              <p>{repliesError}</p>
              <button onClick={fetchReplies}>Try Again</button>
            </div>
          ) : replies.length > 0 ? (
            <div className="replies-list">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onVoteSuccess={onVoteSuccess}
                  level={level + 1}
                  entityId={entityId || comment.entity_id}
                />
              ))}
            </div>
          ) : (
            <div className="no-replies">
              <p>No replies yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
