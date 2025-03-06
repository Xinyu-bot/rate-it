import React, { memo } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./StarRating.scss";

const StarRating = memo(
  ({ rating, maxRating = 5, onChange, readOnly = false }) => {
    const renderStar = (index) => {
      const starValue = index + 1;
      const filled = starValue <= rating;
      const halfFilled = !filled && starValue - 0.5 <= rating;

      return (
        <span
          key={index}
          className={`star ${
            filled ? "filled" : halfFilled ? "half-filled" : "empty"
          } ${readOnly ? "readonly" : ""}`}
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
          {filled ? <FaStar /> : <FaRegStar />}
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
        <div className="stars">
          {[...Array(maxRating)].map((_, index) => renderStar(index))}
        </div>
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  }
);

StarRating.displayName = "StarRating";

export default StarRating;
