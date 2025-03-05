import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import request from "../../utils/request";
import CommentList from "../../components/comments/CommentList";
import ReviewForm from "../../components/comments/ReviewForm";
import "./EntityDetailPage.scss";

const EntityDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const categories = useSelector((state) => state.categories.list);

  const [entity, setEntity] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshComments, setRefreshComments] = useState(false);

  // Fetch entity details
  useEffect(() => {
    const fetchEntityDetails = async () => {
      try {
        setLoading(true);
        const response = await request.getEntity(id);

        if (response.data && response.data.code === 0) {
          setEntity(response.data.data);
        } else {
          throw new Error("Failed to fetch entity details");
        }
      } catch (err) {
        console.error("Error fetching entity details:", err);
        setError("Failed to load entity details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEntityDetails();
    }
  }, [id]);

  // Fetch comments for this entity
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await request.getCommentThreads({ entity_id: id });

        if (response.data && response.data.code === 0) {
          setComments(response.data.data.comment_threads || []);
        } else {
          throw new Error("Failed to fetch comments");
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        // We don't set the main error state here to still show the entity details
      }
    };

    if (id && !loading) {
      fetchComments();
    }

    // Reset the refresh flag
    if (refreshComments) {
      setRefreshComments(false);
    }
  }, [id, loading, refreshComments]);

  // Find category name
  const getCategoryName = (categoryId) => {
    if (!categories || categories.length === 0) return "Unknown Category";

    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Handle successful comment submission
  const handleCommentSubmitted = () => {
    setRefreshComments(true);
  };

  if (loading) {
    return (
      <div className="entity-detail-page loading">
        <div className="loading-spinner"></div>
        <p>Loading entity details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="entity-detail-page error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="entity-detail-page not-found">
        <h2>Entity Not Found</h2>
        <p>The entity you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="entity-detail-page">
      <div className="entity-header">
        <h1>{entity.name}</h1>
        <div className="entity-category">
          Category: {getCategoryName(entity.category_id)}
        </div>
      </div>

      <div className="entity-content">
        <div className="entity-description">
          <h2>Description</h2>
          <p>{entity.description}</p>
        </div>

        <div className="entity-meta">
          <p>Created: {new Date(entity.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="entity-reviews">
        <h2>Reviews</h2>

        {isAuthenticated ? (
          <ReviewForm
            entityId={id}
            onCommentSubmitted={handleCommentSubmitted}
          />
        ) : (
          <div className="login-prompt">
            <p>Please log in to leave a review.</p>
          </div>
        )}

        <CommentList
          comments={comments}
          onVoteSuccess={handleCommentSubmitted}
        />
      </div>
    </div>
  );
};

export default EntityDetailPage;
