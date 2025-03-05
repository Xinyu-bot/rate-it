import React from "react";
import CommentItem from "./CommentItem";
import "./CommentList.scss";

const CommentList = ({ comments, onVoteSuccess, entityId }) => {
  // Filter out replies (they will be shown nested under their parent comments)
  const parentComments = comments.filter(
    (comment) => !comment.parent_thread_id
  );

  // Sort comments by creation date (newest first)
  const sortedComments = [...parentComments].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  if (comments.length === 0) {
    return (
      <div className="comment-list empty">
        <p>No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      <div className="comment-count">
        <span>
          {comments.length} {comments.length === 1 ? "Review" : "Reviews"}
        </span>
      </div>

      <div className="comments">
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.comment_thread_id}
            comment={comment}
            onVoteSuccess={onVoteSuccess}
            entityId={entityId}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
