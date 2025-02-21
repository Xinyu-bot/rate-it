import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function MyProfilePage() {
  const { isAuthenticated, accessToken } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // If user isn't authenticated, there's no point fetching profile data
    if (!isAuthenticated) {
      setError(new Error("User must be logged in to view this page."));
      setLoading(false);
      return;
    }

    // Reset any previous error/loading states
    setError(null);
    setLoading(true);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          // Attempt to parse JSON error; fallback to generic message
          let errorMsg = "Network response was not ok";
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch {}
          throw new Error(errorMsg);
        }
        return response.json();
      })
      .then((data) => {
        // data should look like: { code, msg, data: { ...user fields... } }
        setProfile(data); // store the entire response object
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [isAuthenticated, accessToken]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error.message}</p>;
  }

  if (!profile) {
    // If there's no error but profile is still null, handle gracefully
    return <p>No profile data available.</p>;
  }

  // Since your backend likely returns { code, msg, data }, you can access user details at profile.data
  const userDetail = profile.data; // for convenience
  return (
    <div>
      <h2>My Profile</h2>
      <p>Code: {profile.code}</p>
      <p>Message: {profile.msg}</p>
      <hr />
      <p>
        <strong>User Name:</strong> {userDetail.userName}
      </p>
      <p>
        <strong>User ID:</strong> {userDetail.userId}
      </p>
      <p>
        <strong>Points Balance:</strong> {userDetail.userPointsBalance}
      </p>
      {/* Display more fields as needed */}
    </div>
  );
}

export default MyProfilePage;
