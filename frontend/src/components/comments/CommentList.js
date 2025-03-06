import React, { useMemo } from "react";
import CommentItem from "./CommentItem";
import { FaCommentAlt, FaCommentSlash } from "react-icons/fa";
import "./CommentList.scss";

const CommentList = ({ comments, onVoteSuccess, entityId }) => {
  // Filter out replies (they will be shown under their parent threads)
  const parentComments = useMemo(
    () => comments.filter((comment) => !comment.parent_thread_id),
    [comments]
  );

  // Sort comments by creation date (newest first)
  const sortedComments = useMemo(
    () =>
      [...parentComments].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ),
    [parentComments]
  );

  if (comments.length === 0) {
    return (
      <div className="comment-list empty" role="status">
        <div className="empty-icon">
          <FaCommentSlash />
        </div>
        <p>No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="comment-list" aria-label="Reviews section">
      <div className="comment-count">
        <FaCommentAlt className="comment-icon" />
        <span>
          {comments.length} {comments.length === 1 ? "Review" : "Reviews"}
        </span>
      </div>

      <div className="comments" role="list">
        {sortedComments.map((comment) => (
          <div key={comment.comment_thread_id || comment.id} role="listitem">
            <CommentItem
              comment={comment}
              onVoteSuccess={onVoteSuccess}
              entityId={entityId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
