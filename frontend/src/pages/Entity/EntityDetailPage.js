import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import { request } from "../../utils/request";
import { fetchCategoriesSuccess } from "../../store/slices/categoriesSlice";
import CommentList from "../../components/comments/CommentList";
import ReviewForm from "../../components/comments/ReviewForm";
import "./EntityDetailPage.scss";

const EntityDetailPage = () => {
  const { id } = useParams();
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
          const fetchedCategories = response.data.data.categories || [];
          setLocalCategories(fetchedCategories);

          // Update Redux store
          dispatch(fetchCategoriesSuccess(fetchedCategories));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    if (!categories || categories.length === 0) {
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
        if (response.data?.code === 0) {
          const data = response.data.data;
          setComments(data.comment_threads || []);
        } else {
          throw new Error("Failed to fetch comments");
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
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
    if (!entity) return "Unknown Category";

    // Use either Redux categories or locally fetched categories
    const categoriesSource =
      categories.length > 0 ? categories : localCategories;

    if (!categoriesSource || categoriesSource.length === 0) {
      return "Loading category...";
    }

    const category = categoriesSource.find(
      (cat) => cat.id === entity.category_id
    );
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
            <button
              onClick={() =>
                (window.location.href =
                  "/login?redirect=" +
                  encodeURIComponent(window.location.pathname))
              }
            >
              Go to Login
            </button>
          </div>
        )}

        <CommentList
          comments={comments}
          onVoteSuccess={handleCommentSubmitted}
          entityId={id}
        />
      </div>
    </div>
  );
};

export default EntityDetailPage;
