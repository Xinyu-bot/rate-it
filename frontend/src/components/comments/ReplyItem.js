import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../utils/request";
import "./ReplyItem.scss";

const ReplyItem = ({ reply }) => {
  const navigate = useNavigate();
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
    if (user && reply.user_id) {
      navigate(`/user/${reply.user_id}`);
    }
  };

  return (
    <div className="reply-item">
      <div className="reply-header">
        <div className="user-info">
          {userLoading ? (
            <span className="username">Loading user...</span>
          ) : (
            <>
              <img
                src={user?.profile_picture || "/images/default-avatar.png"}
                alt={user?.username || "User"}
                className="avatar"
                onClick={navigateToUserProfile}
              />
              <span
                className="username clickable"
                onClick={navigateToUserProfile}
              >
                {user?.username || "Anonymous"}
              </span>
            </>
          )}
        </div>
        <div className="reply-date">{formatDate(reply.created_at)}</div>
      </div>

      <div className="reply-content">
        <p>{reply.content}</p>
      </div>
    </div>
  );
};

export default ReplyItem;
