import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { request } from "../../utils/request";
import {
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaSignInAlt,
} from "react-icons/fa";
import "./ReplyForm.scss";

const ReplyForm = ({ threadId, entityId, onReplySubmitted, onCancel }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 1000;

  useEffect(() => {
    // Auto-focus the textarea when the form is shown
    if (textareaRef.current && isAuthenticated) {
      textareaRef.current.focus();
    }
  }, [isAuthenticated]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
      setCharCount(newContent.length);
    }
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: window.location.pathname,
          message: "You must be logged in to reply",
        },
      });
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
        setCharCount(0);

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
        <button
          className="login-button"
          onClick={() =>
            navigate("/login", {
              state: {
                from: window.location.pathname,
                message: "You must be logged in to reply",
              },
            })
          }
          aria-label="Go to login page"
        >
          <FaSignInAlt className="icon" /> Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="reply-form">
      <form onSubmit={handleSubmit} aria-label="Reply form">
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
            ref={textareaRef}
            aria-label="Reply content"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "reply-error" : undefined}
          />
          <div className="char-counter">
            <span className={charCount > MAX_CHARS * 0.9 ? "near-limit" : ""}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>
        </div>

        {error && (
          <div className="form-error" id="reply-error" role="alert">
            <FaExclamationCircle className="icon" /> {error}
          </div>
        )}

        {success && (
          <div className="form-success" role="status">
            <FaCheckCircle className="icon" /> Reply submitted successfully!
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={submitting}
            aria-label="Cancel reply"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={submitting || content.trim().length < 3}
            aria-label="Submit reply"
          >
            {submitting ? (
              <>
                <FaSpinner className="icon spinner" /> Submitting...
              </>
            ) : (
              "Submit Reply"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
