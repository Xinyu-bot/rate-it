import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import { request } from "../../utils/request";
import { fetchCategoriesSuccess } from "../../store/slices/categoriesSlice";
import CommentList from "../../components/comments/CommentList";
import ReviewForm from "../../components/comments/ReviewForm";
import "./EntityDetailPage.scss";

const EntityDetailPage = () => {
  // Extract the full UUID from the URL path directly
  const location = useLocation();
  const entityId = location.pathname.split("/entity/")[1];

  const { isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.list);

  const [entity, setEntity] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshComments, setRefreshComments] = useState(false);
  const [localCategories, setLocalCategories] = useState([]);

  // Fetch categories if not available in Redux
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await request.getCategories();

        if (response.data?.code === 0) {
          const categoriesData = response.data.data.categories;
          setLocalCategories(categoriesData);
          dispatch(fetchCategoriesSuccess(categoriesData));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    if (categories.length === 0) {
      fetchCategories();
    } else {
      setLocalCategories(categories);
    }
  }, [categories, dispatch]);

  // Fetch entity details
  useEffect(() => {
    const fetchEntityDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!entityId) {
          throw new Error("Invalid entity ID");
        }

        const response = await request.getEntity(entityId);

        if (response.data?.code === 0) {
          setEntity(response.data.data);
        } else {
          throw new Error("Failed to fetch entity details");
        }
      } catch (err) {
        console.error("Error fetching entity details:", err);
        setError(err.message || "Failed to fetch entity details");
      } finally {
        setLoading(false);
      }
    };

    fetchEntityDetails();
  }, [entityId]);

  // Fetch comments for this entity
  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!entityId) return;

        const response = await request.getCommentThreads({
          entity_id: entityId,
        });

        if (response.data?.code === 0) {
          setComments(response.data.data.comment_threads || []);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [entityId, refreshComments]);

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    // First try to get from Redux store
    const category = categories.find((cat) => cat.id === categoryId);

    // If not found in Redux, try from local state
    if (!category && localCategories.length > 0) {
      const localCategory = localCategories.find(
        (cat) => cat.id === categoryId
      );
      return localCategory ? localCategory.name : "Unknown Category";
    }

    return category ? category.name : "Unknown Category";
  };

  // Handle comment submission success
  const handleCommentSubmitted = () => {
    setRefreshComments((prev) => !prev);
  };

  // Handle vote success
  const handleVoteSuccess = () => {
    setRefreshComments((prev) => !prev);
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
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="entity-detail-page not-found">
        <h2>Entity Not Found</h2>
        <p>The entity you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="entity-detail-page">
      <div className="entity-header">
        <h1>{entity.name}</h1>
        <div className="entity-category">
          <span className="category-label">Category:</span>
          <span className="category-value">
            {getCategoryName(entity.category_id)}
          </span>
        </div>
      </div>

      <div className="entity-content">
        <div className="entity-description">
          <h2>Description</h2>
          <p>{entity.description || "No description available."}</p>
        </div>

        <div className="entity-details">
          <h2>Details</h2>
          <div className="detail-item">
            <span className="detail-label">Address:</span>
            <span className="detail-value">
              {entity.address || "Not specified"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Contact:</span>
            <span className="detail-value">
              {entity.contact || "Not specified"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Website:</span>
            {entity.website ? (
              <a
                href={entity.website}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-value website"
              >
                {entity.website}
              </a>
            ) : (
              <span className="detail-value">Not specified</span>
            )}
          </div>
        </div>
      </div>

      <div className="entity-reviews">
        <h2>Reviews</h2>
        {isAuthenticated ? (
          <ReviewForm
            entityId={entityId}
            onReviewSubmitted={handleCommentSubmitted}
          />
        ) : (
          <div className="login-prompt">
            <p>Please log in to leave a review.</p>
            <a
              href={`/login?redirect=/entity/${entityId}`}
              className="login-button"
            >
              Log In
            </a>
          </div>
        )}

        <CommentList
          comments={comments}
          onVoteSuccess={handleVoteSuccess}
          entityId={entityId}
        />
      </div>
    </div>
  );
};

export default EntityDetailPage;
