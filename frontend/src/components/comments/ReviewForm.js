import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import request from "../../utils/request";
import StarRating from "./StarRating";
import "./ReviewForm.scss";

const ReviewForm = ({ entityId, onCommentSubmitted }) => {
  const { userId } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (content.trim().length < 10) {
      setError("Please enter a review with at least 10 characters");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const commentData = {
        entity_id: parseInt(entityId),
        user_id: userId,
        rating,
        content: content.trim(),
      };

      const response = await request.createCommentThread(commentData);

      if (response.data && response.data.code === 0) {
        setSuccess(true);
        setContent("");
        setRating(0);

        // Notify parent component to refresh comments
        if (onCommentSubmitted) {
          onCommentSubmitted();
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit your review. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group rating-group">
          <label>Your Rating</label>
          <StarRating
            rating={rating}
            onChange={handleRatingChange}
            readOnly={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="review-content">Your Review</label>
          <textarea
            id="review-content"
            value={content}
            onChange={handleContentChange}
            placeholder="Share your experience with this entity..."
            rows={5}
            disabled={submitting}
            required
          />
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && (
          <div className="form-success">
            Your review has been submitted successfully!
          </div>
        )}

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
