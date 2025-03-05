import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import request from "../../utils/request";

const MyProfilePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If the user is not authenticated, set an error immediately.
    if (!isAuthenticated) {
      setError(new Error("User must be logged in to view this page."));
      setLoading(false);
      return;
    }

    // Reset any previous error/loading state and fetch profile data
    setError(null);
    setLoading(true);

    const fetchProfile = async () => {
      try {
        const response = await request.getCurrentUser();

        // Expected response structure: { code, msg, data: { ...user fields... } }
        if (response.data && response.data.code === 0 && response.data.data) {
          setProfile(response.data.data);
        } else {
          throw new Error("Failed to fetch profile data");
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return (
      <p className="error-message" style={{ color: "red" }}>
        Error: {error.message}
      </p>
    );
  }

  if (!profile) {
    return <p>No profile data available.</p>;
  }

  return (
    <div className="home-page my-profile-page">
      <h2>My Profile</h2>
      <hr />
      <p>
        <strong>User ID:</strong> {profile.id}
      </p>
      <p>
        <strong>User Name:</strong> {profile.username}
      </p>
      <p>
        <strong>Points Balance:</strong> {profile.user_point_balance}
      </p>
      <p>
        <strong>Status:</strong> {profile.status}
      </p>
      <p>
        <strong>Permission:</strong> {profile.role}
      </p>
    </div>
  );
};

export default MyProfilePage;
