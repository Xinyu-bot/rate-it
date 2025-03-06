import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { request } from "../../utils/request";
import "./ReplyForm.scss";

const ReplyForm = ({ threadId, entityId, onReplySubmitted, onCancel }) => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!isAuthenticated) {
      setError("You must be logged in to reply");
      return;
    }

    if (content.trim().length < 3) {
      setError("Please enter a reply with at least 3 characters");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const replyData = {
        thread_id: threadId,
        entity_id: entityId,
        user_id: userId,
        content: content.trim(),
      };

      const response = await request.createCommentReply(threadId, replyData);

      if (response.data?.code === 0) {
        setSuccess(true);
        setContent("");

        // Notify parent component to refresh comments
        if (onReplySubmitted) {
          onReplySubmitted();
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          if (onCancel) onCancel();
        }, 3000);
      } else {
        throw new Error(response.data?.msg || "Failed to submit reply");
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
      setError("Failed to submit your reply. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="reply-form not-authenticated">
        <p>Please log in to reply to this comment.</p>
      </div>
    );
  }

  return (
    <div className="reply-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            id="reply-content"
            name="content"
            value={content}
            onChange={handleContentChange}
            placeholder="Write your reply..."
            rows={3}
            disabled={submitting}
            required
          />
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && (
          <div className="form-success">Reply submitted successfully!</div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={submitting || content.trim().length < 3}
          >
            {submitting ? "Submitting..." : "Submit Reply"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
