import React from "react";
import "./StarRating.scss";

const StarRating = ({ rating, maxRating = 5, onChange, readOnly = false }) => {
  const renderStar = (index) => {
    const starValue = index + 1;
    const filled = starValue <= rating;

    return (
      <span
        key={index}
        className={`star ${filled ? "filled" : "empty"} ${
          readOnly ? "readonly" : ""
        }`}
        onClick={() => !readOnly && onChange && onChange(starValue)}
        onKeyDown={(e) => {
          if (!readOnly && onChange && (e.key === "Enter" || e.key === " ")) {
            onChange(starValue);
            e.preventDefault();
          }
        }}
        role={readOnly ? "presentation" : "button"}
        tabIndex={readOnly ? -1 : 0}
        aria-label={
          readOnly
            ? `${rating} out of ${maxRating} stars`
            : `Rate ${starValue} out of ${maxRating} stars`
        }
      >
        {filled ? "★" : "☆"}
      </span>
    );
  };

  return (
    <div
      className="star-rating"
      aria-label={
        readOnly ? `Rating: ${rating} out of ${maxRating}` : "Rate this item"
      }
    >
      {[...Array(maxRating)].map((_, index) => renderStar(index))}
      <span className="rating-value">{rating}</span>
    </div>
  );
};

export default StarRating;
