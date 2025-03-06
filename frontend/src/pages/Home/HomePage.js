import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  setSelectedCategory,
} from "../../store/slices/categoriesSlice";
import { request } from "../../utils/request";
import "./HomePage.scss";

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    list: categories,
    loading,
    error,
    selectedCategoryId,
  } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const [entities, setEntities] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Only fetch categories once when the component mounts
    const fetchCategories = async () => {
      try {
        dispatch(fetchCategoriesStart());
        const response = await request.getCategories();

        if (
          response.data &&
          response.data.code === 0 &&
          response.data.data.categories
        ) {
          dispatch(fetchCategoriesSuccess(response.data.data.categories));
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (err) {
        dispatch(
          fetchCategoriesFailure(err.message || "Failed to fetch categories")
        );
      }
    };

    // If we haven't loaded categories yet, fetch them
    if (!categories || categories.length === 0) {
      fetchCategories();
    }
  }, [categories, dispatch]); // <-- No selectedCategoryId here

  // Separate effect to set first category if none is selected
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      dispatch(setSelectedCategory(categories[0].id));
    }
  }, [categories, selectedCategoryId, dispatch]);

  // Handle category selection
  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(parseInt(e.target.value)));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchTerm.trim() === "") {
      setSearchError("Please enter a search term");
      return;
    }

    if (!selectedCategoryId) {
      setSearchError("Please select a category first");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchError(null);

    try {
      const response = await request.getEntities({
        category_id: selectedCategoryId,
        entity_name: searchTerm.trim() || undefined,
      });

      if (response.data && response.data.code === 0) {
        setEntities(response.data.data.entities || []);
      } else {
        throw new Error("Failed to fetch entities");
      }
    } catch (err) {
      setSearchError(err.message || "Failed to search entities");
      setEntities([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Find and Review Public Entities</h1>
        <p>Search for public entities and share your experiences</p>

        <div className="search-container">
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label htmlFor="category-select">Category</label>
              <select
                id="category-select"
                value={selectedCategoryId || ""}
                onChange={handleCategoryChange}
                disabled={loading}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {loading && (
                <span className="loading-indicator">Loading categories...</span>
              )}
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="entity-search">Search</label>
              <input
                id="entity-search"
                type="text"
                placeholder="Enter entity name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <button
              type="submit"
              className="search-button"
              disabled={isSearching || !selectedCategoryId}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {searchError && <div className="search-error">{searchError}</div>}
        </div>
      </div>

      {entities.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="entities-list">
            {entities.map((entity) => (
              <Link
                to={`/entity/${entity.id}`}
                key={entity.id}
                className="entity-card-link"
              >
                <div className="entity-card">
                  <h3>{entity.name}</h3>
                  <p>{entity.description}</p>
                  <div className="view-details">View Details</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {entities.length === 0 &&
        hasSearched &&
        searchTerm &&
        !isSearching &&
        !searchError && (
          <div className="no-results">
            <p>No entities found matching your search criteria.</p>
          </div>
        )}
    </div>
  );
};

export default HomePage;
