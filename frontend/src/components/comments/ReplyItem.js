import React, { useState, useEffect, useContext, memo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { request } from "../../utils/request";
import { FaUser } from "react-icons/fa";
import "./ReplyItem.scss";

const ReplyItem = memo(({ reply }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setUserLoading(true);
        const response = await request.getUserProfile(reply.user_id);

        if (response.data?.code === 0) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setUserLoading(false);
      }
    };

    if (reply.user_id) {
      fetchUserDetails();
    }
  }, [reply.user_id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const navigateToUserProfile = () => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      navigate("/login", {
        state: {
          from: window.location.pathname,
          message: "Please log in to view user profiles",
        },
      });
      return;
    }

    if (user && reply.user_id) {
      navigate(`/user/${reply.user_id}`);
    }
  };

  return (
    <div className="reply-item" role="article">
      <div className="reply-header">
        <div className="user-info">
          {userLoading ? (
            <span className="username">Loading user...</span>
          ) : (
            <>
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={`${user.username}'s avatar`}
                  className="avatar"
                  onClick={navigateToUserProfile}
                  loading="lazy"
                />
              ) : (
                <div
                  className="avatar avatar-placeholder"
                  onClick={navigateToUserProfile}
                >
                  <FaUser />
                </div>
              )}
              <span
                className="username clickable"
                onClick={navigateToUserProfile}
              >
                {user?.username || "Anonymous"}
              </span>
            </>
          )}
        </div>
        <div
          className="reply-date"
          title={new Date(reply.created_at).toLocaleString()}
        >
          {formatDate(reply.created_at)}
        </div>
      </div>

      <div className="reply-content">
        <p>{reply.content}</p>
      </div>
    </div>
  );
});

ReplyItem.displayName = "ReplyItem";

export default ReplyItem;
